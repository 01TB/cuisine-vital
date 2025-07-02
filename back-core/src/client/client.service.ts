import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
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
        private jwtService: JwtService,
    ) {}


    async getClientById(clientId: string) {
        return await this.clientRepository
      .createQueryBuilder('clients')
      .leftJoinAndSelect('clients.role', 'role')
      .where('clients.id = :clientId AND clients.deleted_at IS NULL', { clientId })
      .getOne();
    }

    async generateNewToken(email: string) {
    const client = await this.clientRepository
        .createQueryBuilder('clients')
        .leftJoinAndSelect('clients.role', 'role')
        .where('clients.email = :email AND clients.deleted_at IS NULL', { email })
        .getOne();

    if (!client) {
        throw new Error('Client non trouvé');
    }

    const payload = { 
        email: client.email, 
        sub: client.id 
    };

    return {
        access_token: this.jwtService.sign(payload),
        user: {
        id: client.id,
        email: client.email,
        nom: client.nom,
        prenom: client.prenom
        },
    };
    }

  async validateClient(email: string, password: string) {
    const res = await this.clientRepository.createQueryBuilder('clients')
      .leftJoinAndSelect('clients.role', 'role')
      .where('clients.email = :email AND clients.deleted_at IS NULL', { email })
      .getOne();

    if (res && res.motDePasse === password) { // Still comparing with motDePasse from DB
      return res;
    }

    return null;
  }

    async login(email: string, motDePasse: string)
    {
        const client = await this.validateClient(email, motDePasse);
        if(client == null)
        {
            throw new Error('Erreur lors de la connexion!');
        }
        const payload = { email: client.email, sub: client.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: client.id,
                email: client.email,
                nom: client.nom,
                prenom: client.prenom
            },
        };
    }

    async creerCommandeClient(
    clientIndividuel: boolean,
    createCommande: CreateCommande
    ) {
        const cmdRepo: Repository<any> = clientIndividuel
            ? this.cmdInvRepo
            : this.cmdEntrRepo;

        const cmdDetailsRepo: Repository<any> = clientIndividuel
            ? this.cmdInvDetailsRepo
            : this.cmdEntrDetailsRepo;

        const { details, ...commandeData } = createCommande;

        const commande = cmdRepo.create(commandeData);
        const savedCommande = await cmdRepo.save(commande);

        const cmdDetailsRes = [];

        for (const d of details) {

            const menu = await this.menuRepo.findOne({ where: { id: d.menuId } })
            const boisson = await this.boissonsRepo.findOne({ where: { id: d.boissonId } })
            const acc = await this.accRepo.findOne({ where: { id: d.accompagnementId } })

            const { menuId, accompagnementId, boissonId, ...detailsData } = d;

            const createDetails = {
                ...detailsData,
                menu, 
                boisson, 
                accompagnement: acc,
                commande: savedCommande
            }

            const detail = cmdDetailsRepo.create(createDetails);
            const savedDetail = await cmdDetailsRepo.save(detail);
            cmdDetailsRes.push(savedDetail);
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
}
