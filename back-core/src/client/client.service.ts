import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
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

    async getCommandes(clientIndividuel: boolean, dateCommande=null, dateLivraison=null, adresseLivraison=null, clientId=null)
    {
        const query = clientIndividuel ? 
            this.cmdInvRepo.createQueryBuilder('commandes')
            : 
            this.cmdEntrRepo.createQueryBuilder('commandes');
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
}
