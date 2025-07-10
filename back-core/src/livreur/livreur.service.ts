import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { LivraisonsEntreprises } from '../entities/LivraisonsEntreprises';
import { LivraisonsIndividuelles } from '../entities/LivraisonsIndividuelles';
import { Utilisateurs } from '../entities/Utilisateurs';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CommandeType, StatutLivraison } from './enums/commande-type.enum';
import { OsrmService } from '../osrm/osrm.service';

@Injectable()
export class LivreurService {

    constructor(
        @InjectRepository(LivraisonsIndividuelles)
        private readonly livraisonsIndividuellesRepo: Repository<LivraisonsIndividuelles>,

        @InjectRepository(LivraisonsEntreprises)
        private readonly livraisonsEntreprisesRepo: Repository<LivraisonsEntreprises>,

        @InjectRepository(Utilisateurs)
        private readonly utilisateursRepo: Repository<Utilisateurs>,

        private readonly osrmService: OsrmService,
    ) { }


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
                    role: { nom: 'LIVREUR' },
                    actif: true,
                },
                relations: ['role'],
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des livreurs: ${error.message}`);
        }
    }


    async getItinerairePourLivreur(livreurId: string): Promise<any> {
        // 1. Valider que le livreur existe
        const livreur = await this.utilisateursRepo.findOne({
            where: { id: livreurId, role: { nom: 'LIVREUR' } },
        });

        if (!livreur) {
            throw new NotFoundException(`Livreur avec l'ID "${livreurId}" non trouvé.`);
        }

        // 2. Définir les statuts pour lesquels un itinéraire est pertinent
        const statutsActifs = [StatutLivraison.EN_ROUTE, StatutLivraison.ASSIGNEE];

        // 3. Récupérer toutes les livraisons actives pour ce livreur
        const promiseLivraisonsInd = this.livraisonsIndividuellesRepo.find({
            where: {
                livreur: { id: livreurId },
                statut: In(statutsActifs),
                localisation: Not(IsNull()) // Ne prendre que les livraisons avec des coordonnées
            },
            select: ['id', 'adresse', 'statut', 'localisation'],
        });

        const promiseLivraisonsEnt = this.livraisonsEntreprisesRepo.find({
            where: {
                livreur: { id: livreurId },
                statut: In(statutsActifs),
                localisation: Not(IsNull())
            },
            select: ['id', 'adresse', 'statut', 'localisation'],
        });

        const [livraisonsIndividuelles, livraisonsEntreprises] = await Promise.all([
            promiseLivraisonsInd,
            promiseLivraisonsEnt,
        ]);

        // 4. Combiner et formater les résultats
        const livraisonsPourItineraire = [
            ...livraisonsIndividuelles.map(l => ({ ...l, type: CommandeType.INDIVIDUELLE })),
            ...livraisonsEntreprises.map(l => ({ ...l, type: CommandeType.ENTREPRISE })),
        ];

        // 5. CORRECTION CLÉ : Gérer le cas de 0 ou 1 point de livraison
        // On ne lève plus d'erreur, on retourne un objet partiel.
        if (livraisonsPourItineraire.length < 2) {
            return {
                route: null,
                livraisons: livraisonsPourItineraire,
            };
        }

        // 6. Si on a 2 points ou plus, on procède au calcul de l'itinéraire
        const points = livraisonsPourItineraire.map(livraison => {
            const coords = (livraison.localisation as any).coordinates;
            // Le format pour beaucoup de services de routage est [longitude, latitude]
            // Si le vôtre est différent, ajustez ici.
            return [coords[0], coords[1]] as [number, number]; 
        });

        try {
            const routeCalc = await this.osrmService.getItineraire(points); // ou votre service
            
            // On retourne la structure complète attendue par le front-end
            return {
                route: routeCalc,
                livraisons: livraisonsPourItineraire,
            };

        } catch (error) {
            // En cas d'erreur du service de routage, on la propage.
            console.error("Erreur du service de routage :", error);
            throw new BadRequestException("Le calcul de l'itinéraire a échoué.");
        }
    }


    async getLivraisonsPourLivreur(livreurId: string) {
        // C'est une bonne pratique de vérifier d'abord si le livreur existe
        const livreur = await this.utilisateursRepo.findOne({ where: { id: livreurId } });
        if (!livreur) {
            throw new NotFoundException(`Livreur avec l'ID "${livreurId}" non trouvé.`);
        }

        // On reprend la logique de getAllLivraisons, mais en ajoutant un `where`
        const promiseIndividuelles = this.livraisonsIndividuellesRepo.find({
            where: { livreur: { id: livreurId } }, // <-- Le filtre crucial !
            select: ['id', 'adresse', 'localisation', 'statut', 'heureLivraison'],
            relations: { livreur: true },
        });

        const promiseEntreprises = this.livraisonsEntreprisesRepo.find({
            where: { livreur: { id: livreurId } }, // <-- Le filtre crucial !
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
}
