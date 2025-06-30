import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { In, Repository } from 'typeorm';

// L'interface DTO est réutilisable pour toutes les listes de commandes
export interface CommandeLivreurDto {
  id: string;
  type: 'individuelle' | 'entreprise';
  numeroCommande: string;
  dateLivraison: string;
  adresseLivraison: string;
  montantTotal: string;
  client: {
    id: string;
    nom: string;
  };
  statut: {
    id: number;
    libelle: string;
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
   * Récupère les commandes assignées à un livreur qui sont prêtes à être livrées.
   * @param livreurId L'ID de l'utilisateur livreur
   */
  async getCommandesALivrer(livreurId: string): Promise<CommandeLivreurDto[]> {
    // ▼▼▼ IMPORTANT ▼▼▼
    // Définissez ici les IDs des statuts qui signifient "à livrer".
    // Par exemple: 2 = "Prête à être livrée"
    const STATUTS_A_LIVRER = [2]; 
    return this.findCommandesByStatuts(livreurId, STATUTS_A_LIVRER);
  }

  /**
   * NOUVELLE FONCTION
   * Récupère les commandes assignées à un livreur qui sont actuellement en cours de livraison.
   * @param livreurId L'ID de l'utilisateur livreur
   */
  async getCommandesEnCours(livreurId: string): Promise<CommandeLivreurDto[]> {
    // ▼▼▼ IMPORTANT ▼▼▼
    // Définissez ici l'ID du statut qui signifie "en cours de livraison".
    // Par exemple: 3 = "En cours de livraison"
    const STATUTS_EN_COURS = [3];
    return this.findCommandesByStatuts(livreurId, STATUTS_EN_COURS);
  }


  /**
   * MÉTHODE PRIVÉE REFACTORISÉE
   * Moteur de recherche pour trouver les commandes (individuelles et entreprises) d'un livreur
   * en fonction d'une liste de statuts.
   * @param livreurId L'ID du livreur
   * @param statutIds Un tableau d'IDs de statuts à rechercher
   */
  private async findCommandesByStatuts(livreurId: string, statutIds: number[]): Promise<CommandeLivreurDto[]> {
    if (!statutIds || statutIds.length === 0) {
        return [];
    }

    const [commandesIndividuelles, commandesEntreprises] = await Promise.all([
      this.commandesIndRepo.find({
        where: {
          livreurId: livreurId,
          statutId: In(statutIds),
          deletedAt: null,
        },
        relations: ['client', 'statut'], 
      }),
      this.commandesEntRepo.find({
        where: {
          livreurId: livreurId,
          statutId: In(statutIds),
          deletedAt: null,
        },
        relations: ['client', 'statut'],
      }),
    ]);
    
    const commandesIndividuellesDto: CommandeLivreurDto[] = commandesIndividuelles.map((cmd) => this.formatToDto(cmd, 'individuelle'));
    const commandesEntreprisesDto: CommandeLivreurDto[] = commandesEntreprises.map((cmd) => this.formatToDto(cmd, 'entreprise'));

    const toutesLesCommandes = [...commandesIndividuellesDto, ...commandesEntreprisesDto];

    return toutesLesCommandes.sort((a, b) => 
        new Date(a.dateLivraison).getTime() - new Date(b.dateLivraison).getTime()
    );
  }

  /**
   * MÉTHODE PRIVÉE D'AIDE
   * Formate une entité de commande en DTO standard.
   */
  private formatToDto(commande: CommandesIndividuelles | CommandesEntreprises, type: 'individuelle' | 'entreprise'): CommandeLivreurDto {
    return {
        id: commande.id,
        type: type,
        numeroCommande: commande.numeroCommande,
        dateLivraison: commande.dateLivraison,
        adresseLivraison: commande.adresseLivraison,
        montantTotal: commande.montantTotal,
        client: {
            id: (commande.client as any).id,
            nom: (commande.client as any).nom, // Adaptez avec le vrai nom du champ
        },
        statut: {
            id: (commande.statut as any).id,
            libelle: (commande.statut as any).libelle, // Adaptez avec le vrai nom du champ
        }
    }
  }
}