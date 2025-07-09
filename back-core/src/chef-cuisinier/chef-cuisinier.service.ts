import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandesEntreprises } from 'src/entities/CommandesEntreprises';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';
import { StatutsCommande } from 'src/entities/StatutsCommande';
import { In, Repository } from 'typeorm';
import { UpdateCommandeStatutDto } from './dto/update-commande-statut.dto';

@Injectable()
export class ChefCuisinierService {
  constructor(
    @InjectRepository(CommandesIndividuelles)
    private readonly commandesIndividuellesRepo: Repository<CommandesIndividuelles>,
    @InjectRepository(CommandesEntreprises)
    private readonly commandesEntreprisesRepo: Repository<CommandesEntreprises>,
    @InjectRepository(StatutsCommande)
    private readonly statutsCommandeRepo: Repository<StatutsCommande>,
  ) {}

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

  private async updateStatut<
    T extends CommandesIndividuelles | CommandesEntreprises,
  >(
    id: string,
    dto: UpdateCommandeStatutDto,
    repo: Repository<T>,
  ): Promise<T> {
    // 1. Vérifier que le statut demandé existe
    const statut = await this.statutsCommandeRepo.findOneBy({
      id: dto.statutId,
    });
    if (!statut) {
      throw new BadRequestException(
        `Le statut avec l'ID ${dto.statutId} n'existe pas.`,
      );
    }

    // 2. Vérifier que la commande existe
    const commande = await repo.findOneBy({ id } as any);
    if (!commande) {
      throw new NotFoundException(`La commande avec l'ID ${id} est introuvable.`);
    }

    // 3. Mettre à jour le statut et sauvegarder
    commande.statutId = dto.statutId;
    return repo.save(commande);
  }

  async updateCommandeIndividuelleStatut(
    id: string,
    dto: UpdateCommandeStatutDto,
  ): Promise<CommandesIndividuelles> {
    return this.updateStatut<CommandesIndividuelles>(
      id,
      dto,
      this.commandesIndividuellesRepo,
    );
  }

  async updateCommandeEntrepriseStatut(
    id: string,
    dto: UpdateCommandeStatutDto,
  ): Promise<CommandesEntreprises> {
    return this.updateStatut<CommandesEntreprises>(
      id,
      dto,
      this.commandesEntreprisesRepo,
    );
  }
}
