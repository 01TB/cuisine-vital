import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menus } from '../entities/Menus';
import { Recettes } from '../entities/Recettes';
import { Ingredients } from '../entities/Ingredients';
import { DataSource, In, Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';

@Injectable()
export class ChefCuisinierService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(Menus)
    private readonly menusRepo: Repository<Menus>,

    @InjectRepository(Recettes)
    private readonly recettesRepo: Repository<Recettes>,

    @InjectRepository(Ingredients)
    private readonly ingredientsRepo: Repository<Ingredients>,
  ) {}

  async createMenu(dto: CreateMenuDto): Promise<Menus> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const { recette: recettesDto, ...menuData } = dto;

      const ingredientIds = recettesDto.map(r => r.ingredient_id);
      const ingredients = await qr.manager.findBy(Ingredients, { id: In(ingredientIds) });
      if (ingredients.length !== ingredientIds.length) {
        throw new BadRequestException('Un ou plusieurs ingrédients sont invalides.');
      }

      const menu = qr.manager.create(Menus, {
        nom: dto.nom,
        description: dto.description,
        prixCarte: dto.prix_carte,
        tempsPreparation: dto.temps_preparation,
        disponible: false,
        valide: false,
      });

      console.log(menu);
      const savedMenu = await qr.manager.save(menu);

      console.log(savedMenu);

      const recettesEntities = [];
      for (const rd of recettesDto) {
        const ing = ingredients.find(i => i.id === rd.ingredient_id);
        if (!ing) throw new BadRequestException(`Ingredient ${rd.ingredient_id} introuvable`);
        const recette = new Recettes();
        recette.menu = Promise.resolve(savedMenu);
        recette.menuId = savedMenu.id;
        recette.ingredient = Promise.resolve(ing);
        recette.ingredientId = ing.id;
        recette.quantite = rd.quantite;
        recettesEntities.push(recette);
      }

      await qr.manager.save(recettesEntities);
      await qr.commitTransaction();

      return this.menusRepo.findOne({
        where: { id: savedMenu.id },
        relations: { recettes: { ingredient: true } },
      });
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }


  async getAllMenus()
  {
    return this.menusRepo.find();
  }

  async getAllIngredients()
  {
    return this.ingredientsRepo.find();
  }

  async filterCommandes(date: Date = new Date()) {
    const dateStr = date.toISOString().split('T')[0]; 

    const result = await this.dataSource
      .getRepository(CommandesIndividuelles)
      .createQueryBuilder('c')
      .leftJoin('c.commandesIndividuellesDetails', 'd')
      .leftJoin('c.client', 'client')
      .select('c.id', 'id')
      .addSelect('c.numeroCommande', 'numero_commande')
      .addSelect('c.dateCommande', 'date_commande')
      .addSelect('SUM(d.quantite * d.prixUnitaire)', 'montant_total')
      .addSelect('SUM(d.quantite)', 'total_quantite')
      .addSelect('client.nom', 'nom_client')
      .where('DATE(c.dateCommande) = :today', { today: dateStr })
      .groupBy('c.id, client.nom, c.numeroCommande, c.dateCommande')
      .getRawMany();

    return result;
  }

  async getAllCommandes() {
  const result = await this.dataSource
    .getRepository(CommandesIndividuelles)
    .createQueryBuilder('c')
    .leftJoin('c.commandesIndividuellesDetails', 'd')
    .leftJoin('c.client', 'client')
    .select('c.id', 'id')
    .addSelect('c.numeroCommande', 'numero_commande')
    .addSelect('c.dateCommande', 'date_commande')
    .addSelect('SUM(d.quantite * d.prixUnitaire)', 'montant_total')
    .addSelect('SUM(d.quantite)', 'total_quantite')
    .addSelect('client.nom', 'nom_client')
    .groupBy('c.id, client.nom, c.numeroCommande, c.dateCommande')
    .getRawMany();

  return result;
}


}
