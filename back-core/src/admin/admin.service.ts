import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../entities/Roles';
import { Repository } from 'typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { HistoriqueCommandesView } from '../entities/historique-commandes-view.entity';
import { BonsCommande } from '../entities/BonsCommande';

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

    ){}


    //back - Princii
    async getOrderStatusSummary(): Promise<CommandeStatutView[]> {
        return this.commandeStatutViewRepository.find({
          order: {
            ordre: 'ASC',
          },
        });
    }
    
    async getCommandesHistory() {
        const historique = await this.historiqueCommandesViewRepository.find({
        //   where: {
        //     deleted_at: null,
        //   },
          order: {
            date_commande: 'DESC',
          },
            take: 100, // Limite le nombre de résultats pour éviter une surcharge
        });
    
        if (!historique || historique.length === 0) {
          return []; 
        }
        return historique;
    }

    async getBonsCommandes() {
      return this.BonsCommandeRepository.find();
    }

}
