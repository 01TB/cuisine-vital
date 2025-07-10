import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DeepPartial, Repository } from 'typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { StatutsCommande } from '../entities/StatutsCommande';
import { Clients } from '../entities/Clients';
import { CreateCommande } from './dto/create-commande.dto';
import { CommandesIndividuellesDetails } from '../entities/CommandesIndividuellesDetails';
import { CommandesEntreprisesDetails } from '../entities/CommandesEntreprisesDetails';
import { Menus } from '../entities/Menus';
import { Accompagnements } from '../entities/Accompagnements';
import { Boissons } from '../entities/Boissons';
import { Abonnements } from '../entities/Abonnements';
import { TypesAbonnement } from '../entities/TypesAbonnement';
import { BonsCommande } from '../entities/BonsCommande';
import { SelectionsHebdomadaires } from '../entities/SelectionsHebdomadaires';
import { CreateAbonnementDto } from './dto/create-abonnement.dto';
import { CreateBonCommandeDto } from './dto/create-bon-commande.dto';
import { SelectionDto } from './dto/selection.dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Clients)
        private clientRepository: Repository<Clients>,
        @InjectRepository(CommandesIndividuelles)
        private cmdInvRepo: Repository<CommandesIndividuelles>,
        @InjectRepository(CommandesIndividuellesDetails)
        private cmdInvDetailsRepo: Repository<CommandesIndividuellesDetails>,
        @InjectRepository(CommandesEntreprisesDetails)
        private cmdEntrDetailsRepo: Repository<CommandesEntreprisesDetails>,
        @InjectRepository(CommandesEntreprises)
        private cmdEntrRepo: Repository<CommandesEntreprises>,
        @InjectRepository(Menus)
        private menuRepo: Repository<Menus>,
        @InjectRepository(Accompagnements)
        private accRepo: Repository<Accompagnements>,
        @InjectRepository(Boissons)
        private boissonsRepo: Repository<Boissons>,
        @InjectRepository(StatutsCommande)
        private statutRepo: Repository<StatutsCommande>,
        @InjectRepository(Abonnements)
        private abonnementsRepo: Repository<Abonnements>,
        @InjectRepository(TypesAbonnement)
        private typesAbonnementRepo: Repository<TypesAbonnement>,
        @InjectRepository(BonsCommande)
        private bonsCommandeRepo: Repository<BonsCommande>,
        @InjectRepository(SelectionsHebdomadaires)
        private selectionsHebdomadairesRepo: Repository<SelectionsHebdomadaires>

    ) {}

    async saveClient(clientData: Partial<Clients>): Promise<Clients> { 
        const existingClient = await this.clientRepository.findOne({ where: { email: clientData.email } });
        if (existingClient) {
            throw new BadRequestException('Cet email est déjà utilisé.');
        }

        if (clientData.motDePasse) {
            const hashedPassword = await bcrypt.hash(clientData.motDePasse, 10); 
            clientData.motDePasse = hashedPassword;
        } else {
            throw new BadRequestException('Le mot de passe est obligatoire.');
        }

        const client = this.clientRepository.create(clientData);

        return await this.clientRepository.save(client);
    }

    async getClientById(clientId: string) {
        return await this.clientRepository
      .createQueryBuilder('clients')
      .where('clients.id = :clientId AND clients.deleted_at IS NULL', { clientId })
      .getOne();
    }

    async creerCommandeClient(createCommande: CreateCommande) {
        const client = await this.clientRepository.findOne({ where: { id: createCommande.clientId } });
        if (!client) {
            throw new BadRequestException('Client non trouvé.');
        }

        let cmdRepo: Repository<any>;
        let cmdDetailsRepo: Repository<any>;
        let commandeEntity: any; 
        if (client.typeClient === 'PARTICULIER') {
            cmdRepo = this.cmdInvRepo;
            cmdDetailsRepo = this.cmdInvDetailsRepo;
            commandeEntity = this.cmdInvRepo.create(createCommande);
        } else if (client.typeClient === 'ENTREPRISE') {
            cmdRepo = this.cmdEntrRepo;
            cmdDetailsRepo = this.cmdEntrDetailsRepo;
            commandeEntity = this.cmdEntrRepo.create(createCommande);
        } else {
            throw new BadRequestException('Type de client inconnu.');
        }

        commandeEntity.client = client; // Associate the client entity
        if (createCommande.zoneDeLivraison) {
            commandeEntity.zoneDeLivraison = createCommande.zoneDeLivraison;
        }

        let montantTotal = 0;
        const cmdDetailsRes = [];

        for (const d of createCommande.details) {
            let item: any;
            if (d.menuId) {
                item = await this.menuRepo.findOne({ where: { id: d.menuId } });
            } else if (d.accompagnementId) {
                item = await this.accRepo.findOne({ where: { id: d.accompagnementId } });
            } else if (d.boissonId) {
                item = await this.boissonsRepo.findOne({ where: { id: d.boissonId } });
            }

            if (!item) {
                throw new BadRequestException('Article de commande non trouvé.');
            }

            const detailPrice = parseFloat(item.prixCarte || item.prixUnitaire || item.prix) * d.quantite;
            montantTotal += detailPrice;

            const createDetails = {
                quantite: d.quantite,
                prixUnitaire: parseFloat(item.prixCarte || item.prixUnitaire || item.prix),
                notes: d.notes,
                commande: commandeEntity,
                menu: d.menuId ? item : null,
                accompagnement: d.accompagnementId ? item : null,
                boisson: d.boissonId ? item : null,
            };

            const detail = cmdDetailsRepo.create(createDetails);
            cmdDetailsRes.push(detail);
        }

        commandeEntity.montantTotal = montantTotal;
        const savedCommande = await cmdRepo.save(commandeEntity);

        for (const detail of cmdDetailsRes) {
            detail.commande = savedCommande; // Ensure correct association
            await cmdDetailsRepo.save(detail);
        }

        return { commande: savedCommande, details: cmdDetailsRes };
    }

    async getCommandes(clientIndividuel: boolean, dateCommande=null, dateLivraison=null, adresseLivraison=null, clientId=null, statut_id=null, statutOrderLessThan: number | null = null, statutOrder: number | null = null)
    {
        const query = clientIndividuel ? 
            this.cmdInvRepo.createQueryBuilder('commandes')
            : 
            this.cmdEntrRepo.createQueryBuilder('commandes');
        
        query.leftJoinAndSelect('commandes.statut', 'statut'); // Join with StatutsCommande

        if(dateCommande)
        {
            query.andWhere('commandes.dateCommande = :dateCommande', {dateCommande});
        }
        if(dateLivraison)
        {
            query.andWhere('commandes.dateLivraison = :dateLivraison', {dateLivraison});
        }
        if(adresseLivraison)
        {
            query.andWhere('commandes.adresseLivraison = :adresseLivraison', {adresseLivraison});
        }
        if(clientId)
        {
            query.andWhere('commandes.clientId = :clientId', {clientId});
        }
        if(statut_id)
        {
            query.andWhere('commandes.statutId = :statutId', {statut_id});
        }
        if (statutOrderLessThan !== null) {
            query.andWhere('statut.ordre < :statutOrderLessThan', { statutOrderLessThan });
        }
        if (statutOrder !== null) {
            query.andWhere('statut.ordre = :statutOrder', { statutOrder });
        }
        return query.getMany();
    }

    async annulerCommande(commandeIndividuelle: boolean, commandeId: string) {
        const statutAnnulation = await this.statutRepo.findOne({ where: { ordre: 6 } });

        if (!statutAnnulation) {
            throw new Error("Statut d'annulation introuvable.");
        }

        const repo: Repository<any> = commandeIndividuelle ? this.cmdInvRepo : this.cmdEntrRepo;

        const commande = await repo.findOne({ where: { id: commandeId } });

        if (!commande) {
            return { success: false, message: "Commande non trouvée." };
        }

        if (commande.statutId === statutAnnulation.id) {
            return { success: false, message: "Commande déjà annulée." };
        }

        commande.statutId = statutAnnulation.id;
        commande.statut = statutAnnulation;
        commande.deletedAt = new Date();
        const saved = await repo.save(commande);

        return {
            success: true,
            message: "Commande annulée avec succès.",
            commande: saved
        };
    }

    async getAllMenus()
    {
        return this.menuRepo.find();
    }

    async getAllAccompagnements()
    {
        return this.accRepo.find();
    }

    async getAllBoissons()
    {
        return this.boissonsRepo.find();
    }

    async createAbonnement(dto: CreateAbonnementDto): Promise<Abonnements> {
        const { clientId, typeAbonnementId, ...restOfDto } = dto;

        const clientEntity = await this.clientRepository.findOneBy({ id: clientId });
        if (!clientEntity) {
            throw new NotFoundException(`Client with ID ${clientId} not found.`);
        }

        const typeAbonnementEntity = await this.typesAbonnementRepo.findOneBy({ id: typeAbonnementId });
        if (!typeAbonnementEntity) {
            throw new NotFoundException(`Subscription type with ID ${typeAbonnementId} not found.`);
        }

        const abonnementData: DeepPartial<Abonnements> = {
            ...restOfDto,
            actif: restOfDto.actif ?? true, 

            client: Promise.resolve(clientEntity),
            typeAbonnement: Promise.resolve(typeAbonnementEntity),
        };

        const nouvelAbonnement = this.abonnementsRepo.create(abonnementData);

        return this.abonnementsRepo.save(nouvelAbonnement);
    }

    async getAbonnementsByClientId(clientId: string): Promise<Abonnements[]> {
        return this.abonnementsRepo.find({
            where: { 
                clientId: clientId,
                deletedAt: null 
            },
            relations: ['typeAbonnement'], 
        });
    }

    async getAbonnementById(abonnementId: string): Promise<Abonnements> {
        const abonnement = await this.abonnementsRepo.findOne({
            where: { id: abonnementId, deletedAt: null },
            relations: ['typeAbonnement', 'bonsCommandes'],
        });

        if (!abonnement) {
            throw new NotFoundException(`Abonnement avec l'ID ${abonnementId} non trouvé.`);
        }
        return abonnement;
    }


    async cancelAbonnement(abonnementId: string): Promise<Abonnements> {
        const abonnement = await this.getAbonnementById(abonnementId);
        
        abonnement.actif = false;
        abonnement.dateFin = new Date().toISOString().split('T')[0]; 
        abonnement.deletedAt = new Date();

        return this.abonnementsRepo.save(abonnement);
    }


    async createBonCommande(dto: CreateBonCommandeDto): Promise<BonsCommande> {
        const abonnement = await this.getAbonnementById(dto.abonnementId);

        const nouveauBon = this.bonsCommandeRepo.create({
            ...dto,
            abonnement: Promise.resolve(abonnement), 
            statut: 'EN_ATTENTE', 
        });

        return this.bonsCommandeRepo.save(nouveauBon);
    }


    async getBonCommandeById(bonCommandeId: string): Promise<BonsCommande> {
        const bonCommande = await this.bonsCommandeRepo.findOne({
            where: { id: bonCommandeId, deletedAt: null },
            relations: ['selectionsHebdomadaires', 'selectionsHebdomadaires.menu'], 
        });

        if (!bonCommande) {
            throw new NotFoundException(`Bon de commande avec l'ID ${bonCommandeId} non trouvé.`);
        }
        return bonCommande;
    }

    async getBonsCommandeByAbonnementId(abonnementId: string): Promise<BonsCommande[]> {
        return this.bonsCommandeRepo.find({
            where: { abonnement: { id: abonnementId }, deletedAt: null },
            relations: ['selectionsHebdomadaires', 'selectionsHebdomadaires.menu'],
            order: { createdAt: 'DESC' },
        });
    }


    async updateBonCommandeStatus(bonCommandeId: string, statut: string): Promise<BonsCommande> {
        const bonCommande = await this.getBonCommandeById(bonCommandeId);
        bonCommande.statut = statut;
        return this.bonsCommandeRepo.save(bonCommande);
    }



    async saveWeeklySelections(bonCommandeId: string, selections: SelectionDto[]): Promise<SelectionsHebdomadaires[]> {
        const bonCommande = await this.getBonCommandeById(bonCommandeId);

        await this.selectionsHebdomadairesRepo.delete({ bonCommandeId: bonCommande.id });

        const nouvellesSelections: SelectionsHebdomadaires[] = [];
        for (const sel of selections) {
            const menu = await this.menuRepo.findOneBy({ id: sel.menuId });
            if (!menu) {
                throw new BadRequestException(`Menu avec l'ID ${sel.menuId} non trouvé.`);
            }

            const nouvelleSelection = this.selectionsHebdomadairesRepo.create({
                bonCommandeId: bonCommande.id,
                jourSemaine: sel.jourSemaine,
                quantite: sel.quantite,
                menu: Promise.resolve(menu),
            });
            nouvellesSelections.push(nouvelleSelection);
        }

        return this.selectionsHebdomadairesRepo.save(nouvellesSelections);
    }
}
