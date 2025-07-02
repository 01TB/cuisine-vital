import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandeType } from './enums/commande-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { LivraisonsIndividuelles } from '../entities/LivraisonsIndividuelles';
import { LivraisonsEntreprises } from '../entities/LivraisonsEntreprises';
import { StatutLivraison } from './enums/commande-type.enum';


import { HttpService } from '@nestjs/axios'; /* Mila apina amle dependance */
import { firstValueFrom } from 'rxjs';
import { Utilisateurs } from '../entities/Utilisateurs';

import { OsrmService } from '../osrm/osrm.service';

@Injectable()
export class LivreurService {
    constructor(
        @InjectRepository(CommandesIndividuelles)
        private commandesIndividuellesRepo: Repository<CommandesIndividuelles>,

        @InjectRepository(CommandesEntreprises)
        private commandesEntreprisesRepo: Repository<CommandesEntreprises>,


        @InjectRepository(LivraisonsIndividuelles)
        private readonly livraisonsIndividuellesRepo: Repository<LivraisonsIndividuelles>,

        @InjectRepository(LivraisonsEntreprises)
        private readonly livraisonsEntreprisesRepo: Repository<LivraisonsEntreprises>,

        private readonly httpService: HttpService,

        @InjectRepository(Utilisateurs) 
        private readonly utilisateursRepo: Repository<Utilisateurs>,

        private readonly osrmService: OsrmService,
    ) { }



    async updateCommandeStatut(commandeId: string, type: CommandeType, statutId: number): Promise<CommandesIndividuelles | CommandesEntreprises> {
        switch (type) {
            case CommandeType.INDIVIDUELLE:
                return this._updateStatusCommande(this.commandesIndividuellesRepo, commandeId, statutId);
            case CommandeType.ENTREPRISE:
                return this._updateStatusCommande(this.commandesEntreprisesRepo, commandeId, statutId);
            default:
                throw new BadRequestException('Type de commande non valide');
        }
    }



    private async _updateStatusCommande<T extends { id: string, statutId: number }>(
        repository: Repository<T>,
        id: string,
        statutId: number,
    ): Promise<T> {
        const result = await repository.update(id, { statutId: statutId } as any);

        if (result.affected === 0) {
            throw new NotFoundException(`La commande de type '${repository.metadata.tableName}' avec l'ID "${id}" n'a pas été trouvée.`);
        }

        return repository.findOneBy({ id } as any);
    }


    async getAllLivraisons() {
        const promiseIndividuelles = this.livraisonsIndividuellesRepo.find({
            select: ['id', 'adresse', 'localisation', 'statut', 'heureLivraison'],
            relations: { livreur: true },
        });

        const promiseEntreprises = this.livraisonsEntreprisesRepo.find({
            select: ['id', 'adresse', 'localisation', 'statut', 'heureLivraison'],
            relations: { livreur: true },
        });

        const [livraisonsIndividuelles, livraisonsEntreprises] = await Promise.all([
            promiseIndividuelles,
            promiseEntreprises
        ]);

        const formattedIndividuelles = livraisonsIndividuelles.map(livraison => ({
            ...livraison,
            type: CommandeType.INDIVIDUELLE
        }));

        const formattedEntreprises = livraisonsEntreprises.map(livraison => ({
            ...livraison,
            type: CommandeType.ENTREPRISE
        }));

        return [...formattedIndividuelles, ...formattedEntreprises];
    }



    async getAllLivreurs(): Promise<Utilisateurs[]> {
        try {
            return await this.utilisateursRepo.find({
                select: ['id', 'nom', 'prenom'],
                where: {
                    role: { id: 4 },
                    actif: true,
                },
                relations: ['role'],
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des livreurs: ${error.message}`);
        }
    }


    async confirmerLivraison(livraisonId: string, type: CommandeType, statut: StatutLivraison): Promise<LivraisonsIndividuelles | LivraisonsEntreprises> {
        switch (type) {
            case CommandeType.INDIVIDUELLE:
                return this._updateStatutLivraison(this.livraisonsIndividuellesRepo, livraisonId, statut);
            case CommandeType.ENTREPRISE:
                return this._updateStatutLivraison(this.livraisonsEntreprisesRepo, livraisonId, statut);
            default:
                throw new BadRequestException('Type de livraison non valide');
        }
    }

    private async _updateStatutLivraison<T extends { id: string, statut: string }>(
        repository: Repository<T>,
        id: string,
        statut: StatutLivraison,
    ): Promise<T> {
        const result = await repository.update(id, { statut: statut } as any);

        if (result.affected === 0) {
            throw new NotFoundException(`La livraison de type '${repository.metadata.tableName}' avec l'ID "${id}" n'a pas été trouvée.`);
        }

        return repository.findOneBy({ id } as any);
    }



    async getItinerairePourLivreur(livreurId: string): Promise<any> {
        // 1. Vérifier que le livreur existe et est bien un livreur
        const livreur = await this.utilisateursRepo.findOne({
            where: { id: livreurId, role: { id: 4 } }, 
        });

        if (!livreur) {
            throw new NotFoundException(`Livreur avec l'ID "${livreurId}" non trouvé.`);
        }

        // 2. Récupérer toutes les livraisons actives pour ce livreur
        // On ne prend que les statuts qui nécessitent encore une action.
        const statutsActifs = [StatutLivraison.EN_LIVRAISON];

        const promiseLivraisonsInd = this.livraisonsIndividuellesRepo.find({
            where: {
                livreur: { id: livreurId },
                statut: In(statutsActifs),
            },
            select: ['id', 'localisation'],
        });

        const promiseLivraisonsEnt = this.livraisonsEntreprisesRepo.find({
            where: {
                livreur: { id: livreurId },
                statut: In(statutsActifs),
            },
            select: ['id', 'localisation'],
        });

        const [livraisonsIndividuelles, livraisonsEntreprises] = await Promise.all([
            promiseLivraisonsInd,
            promiseLivraisonsEnt,
        ]);

        const toutesLesLivraisons = [...livraisonsIndividuelles, ...livraisonsEntreprises];

        // 3. Extraire et formater les coordonnées
        const points = toutesLesLivraisons
            // S'assurer que la localisation existe
            .filter(livraison => livraison.localisation)
            // Transformer la donnée de la base en [latitude, longitude]
            .map(livraison => {
                // IMPORTANT: Adapter cette partie au format exact retourné par votre base de données.
                // Hypothèse : le format est { type: 'Point', coordinates: [longitude, latitude] }
                const coords = (livraison.localisation as any).coordinates;
                // Le service attend [latitude, longitude]
                return [coords[1], coords[0]] as [number, number];
            });
        
        // Il est courant d'ajouter le point de départ du livreur (ex: l'entrepôt)
        // Pour l'instant, nous nous contentons des points de livraison.

        // 4. Vérifier si on a assez de points pour un itinéraire
        if (points.length < 2) {
            throw new BadRequestException("Pas assez de points de livraison actifs (minimum 2 requis) pour calculer un itinéraire.");
        }

        // 5. Appeler le service de routage avec les points
        try {
            return await this.osrmService.getItineraire(points);
        } catch (error) {
            // On propage l'erreur si le service externe échoue
            throw error;
        }
    }


}
