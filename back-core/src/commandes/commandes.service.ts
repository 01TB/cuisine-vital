// src/commandes/commandes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { StatutsCommande } from '../entities/StatutsCommande';

@Injectable()
export class CommandesService {
  constructor(
    @InjectRepository(CommandesIndividuelles)
    private repoIndividuelles: Repository<CommandesIndividuelles>,
    @InjectRepository(CommandesEntreprises)
    private repoEntreprises: Repository<CommandesEntreprises>,
    @InjectRepository(StatutsCommande)
    private repoStatuts: Repository<StatutsCommande>,
  ) {}

  /**
   * Récupère toutes les commandes (individuelles et entreprises)
   * et les fusionne en une seule liste triée.
   */
  async findAll() {
    const individuelles = await this.repoIndividuelles.find({
      relations: ['client', 'statut'], // Utilise les relations définies dans l'entité
      order: { createdAt: 'DESC' },
    });

    const entreprises = await this.repoEntreprises.find({
      relations: ['client', 'statut'],
      order: { createdAt: 'DESC' },
    });

    // Ajouter un champ 'type' pour les différencier sur le frontend
    const commandes = [
      ...individuelles.map(c => ({ ...c, type: 'individuelle' })),
      ...entreprises.map(c => ({ ...c, type: 'entreprise' })),
    ];

    // Trier le tout par date de création
    return commandes.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });
  }

  /**
   * Récupère tous les statuts de commande possibles.
   */
  findAllStatuts() {
    return this.repoStatuts.find({ order: { ordre: 'ASC' } });
  }

  /**
   * Met à jour le statut d'une commande spécifique.
   */
  async updateStatusCommande(type: 'individuelle' | 'entreprise', id: string, statutId: number) {
    let commande;

    if (type === 'individuelle') {
      commande = await this.repoIndividuelles.findOneBy({ id });
      if (!commande) throw new NotFoundException(`Commande individuelle avec l'ID ${id} non trouvée.`);
      commande.statutId = statutId;
      return this.repoIndividuelles.save(commande);
    } else if (type === 'entreprise') {
      commande = await this.repoEntreprises.findOneBy({ id });
      if (!commande) throw new NotFoundException(`Commande entreprise avec l'ID ${id} non trouvée.`);
      commande.statutId = statutId;
      return this.repoEntreprises.save(commande);
    }

    throw new NotFoundException(`Type de commande '${type}' invalide.`);
  }
}