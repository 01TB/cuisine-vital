import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { In, Repository } from 'typeorm';

// C'est une bonne pratique de définir une interface ou une classe (DTO)
// pour la structure de la réponse.
export interface CommandeLivreurDto {
  id: string;
  type: 'individuelle' | 'entreprise';
  numeroCommande: string;
  dateLivraison: string;
  adresseLivraison: string;
  montantTotal: string;
  client: {
    id: string;
    nom: string; // Supposons que l'entité Client a une propriété 'nom'
  };
  statut: {
    id: number;
    libelle: string; // Supposons que l'entité StatutCommande a 'libelle'
  };
}

@Injectable()
export class LivreurService {
  constructor(
    @InjectRepository(CommandesIndividuelles)
    private readonly commandesIndRepo: Repository<CommandesIndividuelles>,
    @InjectRepository(CommandesEntreprises)
    private readonly commandesEntRepo: Repository<CommandesEntreprises>,
  ) {}

  /**
   * Récupère toutes les commandes (individuelles et entreprises) assignées à un livreur
   * et qui sont prêtes à être livrées ou en cours de livraison.
   * @param livreurId L'ID de l'utilisateur livreur
   */
  async getCommandesALivrer(livreurId: string): Promise<CommandeLivreurDto[]> {
    // --- IMPORTANT ---
    // Définissez ici les ID des statuts qui signifient "à livrer".
    // Vous devez trouver ces IDs dans votre table `statuts_commande`.
    // Par exemple: 2 = "Prête à être livrée", 3 = "En cours de livraison"
    const STATUTS_A_LIVRER = [2, 3];

    const [commandesIndividuelles, commandesEntreprises] = await Promise.all([
      // Récupérer les commandes individuelles
      this.commandesIndRepo.find({
        where: {
          livreurId: livreurId,
          statutId: In(STATUTS_A_LIVRER),
          deletedAt: null, // S'assurer de ne pas prendre les commandes supprimées
        },
        // 'relations' permet de charger les entités liées (client, statut) en une seule requête.
        relations: ['client', 'statut'], 
      }),
      // Récupérer les commandes d'entreprise
      this.commandesEntRepo.find({
        where: {
          livreurId: livreurId,
          statutId: In(STATUTS_A_LIVRER),
          deletedAt: null,
        },
        relations: ['client', 'statut'],
      }),
    ]);
    
    // On formate les commandes individuelles pour avoir une réponse standard
    const commandesIndividuellesDto: CommandeLivreurDto[] = commandesIndividuelles.map((cmd) => ({
        id: cmd.id,
        type: 'individuelle',
        numeroCommande: cmd.numeroCommande,
        dateLivraison: cmd.dateLivraison,
        adresseLivraison: cmd.adresseLivraison,
        montantTotal: cmd.montantTotal,
        client: {
            id: (cmd.client as any).id,
            nom: (cmd.client as any).nom, // Adaptez avec le vrai nom du champ
        },
        statut: {
            id: (cmd.statut as any).id,
            libelle: (cmd.statut as any).libelle, // Adaptez avec le vrai nom du champ
        }
    }));
    
    // On fait de même pour les commandes d'entreprise
    const commandesEntreprisesDto: CommandeLivreurDto[] = commandesEntreprises.map((cmd) => ({
        id: cmd.id,
        type: 'entreprise',
        numeroCommande: cmd.numeroCommande,
        dateLivraison: cmd.dateLivraison,
        adresseLivraison: cmd.adresseLivraison,
        montantTotal: cmd.montantTotal,
        client: {
            id: (cmd.client as any).id,
            nom: (cmd.client as any).nom, // Adaptez avec le vrai nom du champ
        },
        statut: {
            id: (cmd.statut as any).id,
            libelle: (cmd.statut as any).libelle, // Adaptez avec le vrai nom du champ
        }
    }));

    // On combine les deux listes et on les trie par date de livraison
    const toutesLesCommandes = [...commandesIndividuellesDto, ...commandesEntreprisesDto];

    return toutesLesCommandes.sort((a, b) => 
        new Date(a.dateLivraison).getTime() - new Date(b.dateLivraison).getTime()
    );
  }
}