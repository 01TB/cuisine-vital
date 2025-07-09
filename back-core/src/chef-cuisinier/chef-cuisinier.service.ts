import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandesEntreprises } from 'src/entities/CommandesEntreprises';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';
import { In, Repository } from 'typeorm';

@Injectable()
export class ChefCuisinierService {
  constructor(
    @InjectRepository(CommandesIndividuelles)
    private readonly commandesIndividuellesRepo: Repository<CommandesIndividuelles>,
    @InjectRepository(CommandesEntreprises)
    private readonly commandesEntreprisesRepo: Repository<CommandesEntreprises>,
  ) {}

  /**
   * Récupère les commandes individuelles considérées comme "en cours" pour la cuisine.
   * Celles-ci incluent les statuts 'Payée', 'En préparation', et 'Prête'.
   * Les détails complets (client, menus, accompagnements, boissons) sont inclus.
   */
  async findCommandesIndividuellesEnCours(): Promise<CommandesIndividuelles[]> {
    return this.commandesIndividuellesRepo
      .createQueryBuilder('commande')
      .leftJoinAndSelect('commande.statut', 'statut')
      .leftJoinAndSelect(
        'commande.commandesIndividuellesDetails',
        'details',
      )
      .leftJoinAndSelect('details.menu', 'menu')
      .leftJoinAndSelect('details.accompagnement', 'accompagnement')
      .leftJoinAndSelect('details.boisson', 'boisson')
      .leftJoinAndSelect('commande.client', 'client')
      .where('statut.nom IN (:...statuts)', {
        statuts: ['Payée', 'En préparation', 'Prête'],
      })
      .orderBy('commande.dateLivraison', 'ASC')
      .getMany();
  }

  /**
   * Récupère les commandes entreprises considérées comme "en cours" pour la cuisine.
   * Celles-ci incluent les statuts 'Payée', 'En préparation', et 'Prête'.
   * Les détails complets (client, menus, boissons) sont inclus.
   */
  async findCommandesEntreprisesEnCours(): Promise<CommandesEntreprises[]> {
    return this.commandesEntreprisesRepo
      .createQueryBuilder('commande')
      .leftJoinAndSelect('commande.statut', 'statut')
      .leftJoinAndSelect('commande.commandesEntreprisesDetails', 'details')
      .leftJoinAndSelect('details.menu', 'menu')
      .leftJoinAndSelect('details.boisson', 'boisson')
      .leftJoinAndSelect('commande.client', 'client')
      .where('statut.nom IN (:...statuts)', {
        statuts: ['Payée', 'En préparation', 'Prête'],
      })
      .orderBy('commande.dateLivraison', 'ASC')
      .getMany();
  }
}
