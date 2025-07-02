import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../entities/Roles';
import { Repository } from 'typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { HistoriqueCommandesView } from '../entities/historique-commandes-view.entity';
import { BonsCommande } from '../entities/BonsCommande';
import { PaiementsEntreprises } from '../entities/PaiementsEntreprises';
import { PaiementsIndividuels } from '../entities/PaiementsIndividuels';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Roles)
        private roleRepository:Repository<Roles>,

        @InjectRepository(CommandeStatutView)
        private readonly commandeStatutViewRepository: Repository<CommandeStatutView>,

        @InjectRepository(HistoriqueCommandesView) 
        private readonly historiqueCommandesViewRepository: Repository<HistoriqueCommandesView>,

        @InjectRepository(BonsCommande)
        private readonly BonsCommandeRepository : Repository<BonsCommande>,

        @InjectRepository(PaiementsEntreprises)
        private readonly paiementEntreprisesRepository : Repository<PaiementsEntreprises>,

        @InjectRepository(PaiementsIndividuels)
        private readonly paiementIndividuelsRepository : Repository<PaiementsIndividuels>,

    ){}

    async getOrderStatusSummary(): Promise<CommandeStatutView[]> {
        return this.commandeStatutViewRepository.find({
          order: {
            ordre: 'ASC',
          },
        });
    }
    
    async getCommandesHistory() {
        const historique = await this.historiqueCommandesViewRepository.find({
          order: {
            date_commande: 'DESC',
          },
            take: 100,
        });
    
        if (!historique || historique.length === 0) {
          return []; 
        }
        return historique;
    }

    async getBonsCommandes() {
      return this.BonsCommandeRepository.find();
    }

    async getChiffreAffaires(dateDebut: Date, dateFin: Date) {
      const chiffreAffaireIndividuel = await this.paiementIndividuelsRepository
        .createQueryBuilder('paiement')
        .select('SUM(paiement.montant)', 'chiffre_affaires')
        .where('paiement.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
        .getRawOne();
    
      const chiffreAffaireEntreprise = await this.paiementEntreprisesRepository
        .createQueryBuilder('paiement')
        .select('SUM(paiement.montant)', 'chiffre_affaires')
        .where('paiement.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
        .getRawOne();
    
      return {
        chiffre_affaire_individuel: chiffreAffaireIndividuel.chiffre_affaires || 0,
        chiffre_affaire_entreprise: chiffreAffaireEntreprise.chiffre_affaires || 0,
      };
    }
    
    async getNombreCommandeEnCours(dateDebut: Date, dateFin: Date) {
      const nombreCommandeEnCours = await this.historiqueCommandesViewRepository
        .createQueryBuilder('commande')
        .select('COUNT(commande.id_commande)', 'nombre_commande_en_cours')
        .where('commande.statut_commande = :statut', { statut: 'en cours' })
        .andWhere('commande.date_commande BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
        .getRawOne();
    
      return {
        nombre_commande_en_cours: nombreCommandeEnCours.nombre_commande_en_cours || 0,
      };
    }
    
    async getTopMenu(dateDebut: Date, dateFin: Date) {
      const topMenu = await this.historiqueCommandesViewRepository
        .createQueryBuilder('commande')
        .select('commande.nom_menu', 'nom_menu')
        .addSelect('COUNT(commande.id_commande)', 'nombre_commande')
        .where('commande.date_commande BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
        .groupBy('commande.nom_menu')
        .orderBy('nombre_commande', 'DESC')
        .limit(5)
        .getRawMany();
    
      return topMenu;
    }
}
