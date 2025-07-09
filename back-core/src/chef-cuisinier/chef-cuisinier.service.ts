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
import { CreateMenuDto } from './dto/create-menu.dto'
import { Menus } from 'src/entities/Menus';
import { Recettes } from 'src/entities/Recettes';
import { Ingredients } from 'src/entities/Ingredients';
import { DataSource } from 'typeorm';

@Injectable()
export class ChefCuisinierService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(CommandesIndividuelles)
    private readonly commandesIndividuellesRepo: Repository<CommandesIndividuelles>,
    @InjectRepository(CommandesEntreprises)
    private readonly commandesEntreprisesRepo: Repository<CommandesEntreprises>,
    @InjectRepository(StatutsCommande)
    private readonly statutsCommandeRepo: Repository<StatutsCommande>,
    @InjectRepository(Menus)
    private readonly menusRepo: Repository<Menus>,
    @InjectRepository(Ingredients)
    private readonly ingredientsRepo: Repository<Ingredients>,
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

  async createMenu(dto: CreateMenuDto): Promise<Menus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { recettes: recettesDto, ...menuData } = dto;

      const ingredientIds = recettesDto.map((r) => r.ingredientId);
      const ingredients = await queryRunner.manager.findBy(Ingredients, {
        id: In(ingredientIds),
      });
      if (ingredients.length !== ingredientIds.length) {
        throw new BadRequestException(
          "Un ou plusieurs ingrédients spécifiés n'existent pas.",
        );
      }

      const menu = this.menusRepo.create({
        ...menuData,
        disponible: false,
        valide: false,
      });
      const savedMenu = await queryRunner.manager.save(menu);

      const recettes = recettesDto.map((recetteDto) => {
        const ingredient = ingredients.find(
          (i) => i.id === recetteDto.ingredientId,
        );
        // La vérification ci-dessous est la correction clé.
        // Elle assure à TypeScript que `ingredient` n'est pas undefined.
        if (!ingredient) {
          throw new BadRequestException(
            `Incohérence interne: L'ingrédient avec l'ID ${recetteDto.ingredientId} est introuvable.`,
          );
        }
        return queryRunner.manager.create(Recettes, {
          menu: savedMenu.id,
          ingredient: ingredient,
          quantite: recetteDto.quantite
        });
      });
      await queryRunner.manager.save(recettes);

      await queryRunner.commitTransaction();

      return this.menusRepo.findOne({
        where: { id: savedMenu.id },
        relations: {
          recettes: {
            ingredient: true,
          },
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
