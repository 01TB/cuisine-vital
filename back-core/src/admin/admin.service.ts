import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../entities/Roles';
import { Repository } from 'typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { HistoriqueCommandesView } from '../entities/historique-commandes-views.entity';
import { BonsCommande } from '../entities/BonsCommande';
import { PaiementsEntreprises } from '../entities/PaiementsEntreprises';
import { PaiementsIndividuels } from '../entities/PaiementsIndividuels';
import { Salaires } from '../entities/Salaires';
import { Ingredients } from '../entities/Ingredients';
import { FacturesIndividuelles } from '../entities/FacturesIndividuelles';
import { FacturesEntreprises } from '../entities/FacturesEntreprises';
import { Menus } from '../entities/Menus';
import { MouvementsStock } from '../entities/MouvementsStock';
import { Utilisateurs } from '../entities/Utilisateurs';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TopMenusView } from '../entities/TopMenusView';
import { Abonnements } from 'src/entities/Abonnements';
import { TypesAbonnement } from 'src/entities/TypesAbonnement';
import { MenuTypeAbonnement } from 'src/entities/MenuTypeAbonnement';
import { AccompagnementTypeAbonnement } from 'src/entities/AccompagnementTypeAbonnement';
import { Accompagnements } from 'src/entities/Accompagnements';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(TypesAbonnement)
        private typeAbonnementRepo: Repository<TypesAbonnement>,

        @InjectRepository(Accompagnements)
        private accompagnementsRepository: Repository<Accompagnements>,
        
        @InjectRepository(AccompagnementTypeAbonnement)
        private accompagnementTypeAbonnementRepository: Repository<AccompagnementTypeAbonnement>,

        @InjectRepository(MenuTypeAbonnement)
        private menuTypeAbonnementRepository: Repository<MenuTypeAbonnement>,

        @InjectRepository(BonsCommande)
        private bonsCommandeRepository: Repository<BonsCommande>,

        @InjectRepository(Menus)
        private menusRepository: Repository<Menus>,
        
        @InjectRepository(Abonnements)
        private readonly abonnementsRepository: Repository<Abonnements>,

        @InjectRepository(Roles)
        private roleRepository:Repository<Roles>,

        @InjectRepository(CommandeStatutView)
        private readonly commandeStatutViewRepository: Repository<CommandeStatutView>,

        @InjectRepository(HistoriqueCommandesView) 
        private readonly historiqueCommandesViewRepository: Repository<HistoriqueCommandesView>,

        @InjectRepository(BonsCommande)
        private readonly BonsCommandeRepository : Repository<BonsCommande>,

        @InjectRepository(PaiementsEntreprises)
        private readonly paiementEntreprisesRepository : Repository<PaiementsEntreprises>,

        @InjectRepository(PaiementsIndividuels)
        private readonly paiementIndividuelsRepository : Repository<PaiementsIndividuels>,

        @InjectRepository(Salaires)
        private readonly salaireRepository: Repository<Salaires>,

        @InjectRepository(Ingredients)
        private readonly ingredientRepository: Repository<Ingredients>,

        @InjectRepository(FacturesIndividuelles)
        private readonly factureIndividuelleRepository: Repository<FacturesIndividuelles>,

        @InjectRepository(FacturesEntreprises)
        private readonly factureEntrepriseRepository: Repository<FacturesEntreprises>,

        @InjectRepository(Menus)
        private readonly menuRepository: Repository<Menus>,

        @InjectRepository(MouvementsStock)
        private readonly mouvementStockRepository: Repository<MouvementsStock>,

        @InjectRepository(Utilisateurs)
        private readonly utilisateurRepository: Repository<Utilisateurs>,

    ){}

    async getOrderStatusSummary(): Promise<CommandeStatutView[]> {
        return this.commandeStatutViewRepository.find({
          order: {
            ordre: 'ASC',
          },
        });
    }
    
    async getCommandesHistory() {
        const historique = await this.historiqueCommandesViewRepository.find({
          order: {
            date_commande: 'DESC',
          },
            take: 100,
        });
    
        if (!historique || historique.length === 0) {
          return []; 
        }
        return historique;
    }

    async getBonsCommandes() {
      return this.BonsCommandeRepository.find();
    }

    async getChiffreAffaires(dateDebut: Date, dateFin: Date) {
      const chiffreAffaireIndividuel = await this.paiementIndividuelsRepository
        .createQueryBuilder('paiement')
        .select('SUM(paiement.montant)', 'chiffre_affaires')
        .where('paiement.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
        .getRawOne();
    
      const chiffreAffaireEntreprise = await this.paiementEntreprisesRepository
        .createQueryBuilder('paiement')
        .select('SUM(paiement.montant)', 'chiffre_affaires')
        .where('paiement.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
        .getRawOne();
    
      return {
        chiffre_affaire_individuel: chiffreAffaireIndividuel.chiffre_affaires || 0,
        chiffre_affaire_entreprise: chiffreAffaireEntreprise.chiffre_affaires || 0,
      };
    }
    
    async getChiffreAffaireJournalier(date: Date) {
      const dateStr = date.toISOString().slice(0, 10); // format YYYY-MM-DD
      const caInd = await this.paiementIndividuelsRepository
        .createQueryBuilder('paiement')
        .select('SUM(paiement.montant)', 'chiffre_affaires')
        .where('DATE(paiement.date_paiement) = :date', { date: dateStr })
        .getRawOne();
      const caEnt = await this.paiementEntreprisesRepository
        .createQueryBuilder('paiement')
        .select('SUM(paiement.montant)', 'chiffre_affaires')
        .where('DATE(paiement.date_paiement) = :date', { date: dateStr })
        .getRawOne();
      return {
        chiffre_affaire_individuel: caInd && caInd.chiffre_affaires ? caInd.chiffre_affaires : 0,
        chiffre_affaire_entreprise: caEnt && caEnt.chiffre_affaires ? caEnt.chiffre_affaires : 0,
      };
    }
    
    async getNombreCommandeEnCours(dateDebut: string, dateFin: string) {
      // Statuts considérés comme "en cours"
      const statutsEnCours = ['RECUE', 'EN_PREPARATION', 'PRETE'];
      const query = this.historiqueCommandesViewRepository
        .createQueryBuilder('commande')
        .select('COUNT(commande.commande_id)', 'nombre_commande_en_cours')
        .where('commande.statut_nom IN (:...statuts)', { statuts: statutsEnCours });

      if (dateDebut) {
        query.andWhere('commande.date_commande >= :dateDebut', { dateDebut });
      }
      if (dateFin) {
        query.andWhere('commande.date_commande <= :dateFin', { dateFin });
      }

      const result = await query.getRawOne();
      return {
        nombre_commande_en_cours: result?.nombre_commande_en_cours || 0,
      };
    }
    
    async getTopMenu(): Promise<TopMenusView[]> {
      // Utilise la vue v_top_menus pour récupérer le top 5
      return this.menuRepository.manager.getRepository(TopMenusView)
        .createQueryBuilder('top')
        .orderBy('top.quantiteTotale', 'DESC')
        .limit(5)
        .getMany();
    }

    async getTotalDepenses(dateDebut: Date, dateFin: Date) {
        const totalSalaires = await this.salaireRepository
          .createQueryBuilder('salaire')
          .select('SUM(salaire.montant)', 'total_salaires')
          .where('salaire.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
          .getRawOne();
      
        const totalCoutsIngredients = await this.ingredientRepository
          .createQueryBuilder('ingredient')
          .select('SUM(ingredient.cout)', 'total_couts_ingredients')
          .where('ingredient.date_achat BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
          .getRawOne();
      
        return {
          total_depenses: (totalSalaires.total_salaires || 0) + (totalCoutsIngredients.total_couts_ingredients || 0),
        };
      }
      
      async getTopClientsIndividuels(dateDebut: Date, dateFin: Date) {
        const topClients = await this.paiementIndividuelsRepository
          .createQueryBuilder('paiement')
          .select('paiement.id_client', 'id_client')
          .addSelect('SUM(paiement.montant)', 'total_depenses')
          .where('paiement.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
          .groupBy('paiement.id_client')
          .orderBy('total_depenses', 'DESC')
          .limit(5)
          .getRawMany();
      
        return topClients;
      }
      
      async getTopClientsEntreprises(dateDebut: Date, dateFin: Date) {
        const topClients = await this.paiementEntreprisesRepository
          .createQueryBuilder('paiement')
          .select('paiement.id_client', 'id_client')
          .addSelect('SUM(paiement.montant)', 'total_depenses')
          .where('paiement.date_paiement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin })
          .groupBy('paiement.id_client')
          .orderBy('total_depenses', 'DESC')
          .limit(5)
          .getRawMany();
      
        return topClients;
      }

      async getFacturesIndividuelles(dateDebut?: Date, dateFin?: Date, clientId?: string) {
        const query = this.factureIndividuelleRepository.createQueryBuilder('facture')
            .leftJoinAndSelect('facture.details', 'details')
            .leftJoinAndSelect('details.menu', 'menu')
            .leftJoinAndSelect('details.boisson', 'boisson')
            .leftJoinAndSelect('details.accompagnement', 'accompagnement');
    
        if (dateDebut) {
            query.andWhere('facture.date_facture >= :dateDebut', { dateDebut });
        }
        if (dateFin) {
            query.andWhere('facture.date_facture <= :dateFin', { dateFin });
        }
        if (clientId) {
            query.andWhere('facture.id_client = :clientId', { clientId });
        }
    
        return query.getMany();
    }
    
    async getFacturesEntreprises(dateDebut?: Date, dateFin?: Date, clientId?: string) {
        const query = this.factureEntrepriseRepository.createQueryBuilder('facture')
            .leftJoinAndSelect('facture.details', 'details')
            .leftJoinAndSelect('details.menu', 'menu')
            .leftJoinAndSelect('details.boisson', 'boisson')
            .leftJoinAndSelect('details.accompagnement', 'accompagnement');
    
        if (dateDebut) {
            query.andWhere('facture.date_facture >= :dateDebut', { dateDebut });
        }
        if (dateFin) {
            query.andWhere('facture.date_facture <= :dateFin', { dateFin });
        }
        if (clientId) {
            query.andWhere('facture.id_client = :clientId', { clientId });
        }
    
        return query.getMany();
    }
    
    async getCommandeDetails(commandeId: string) {
        const commande = await this.historiqueCommandesViewRepository.findOne({ where: { commande_id: commandeId } });
        if (!commande) {
            return null;
        }
        return commande;
    }
    
    async validateMenu(menuId: number) {
        const menu = await this.menuRepository.findOne({ where: { id: menuId } });
        if (!menu) {
            return null;
        }
        // menu.valide = true;
        return this.menuRepository.save(menu);
    }
    
    async getMouvementStock(dateDebut: Date, dateFin: Date) {
        const query = this.mouvementStockRepository.createQueryBuilder('mouvement')
            .leftJoinAndSelect('mouvement.ingredient', 'ingredient')
            .where('mouvement.date_mouvement BETWEEN :dateDebut AND :dateFin', { dateDebut, dateFin });
    
        return query.getMany();
    }

    // CRUD Menus
    createMenu(createMenuDto: CreateMenuDto) {
        const newMenu = this.menuRepository.create(createMenuDto);
        return this.menuRepository.save(newMenu);
    }

    findAllMenus() {
        return this.menuRepository.find();
    }

    findOneMenu(id: number) {
        return this.menuRepository.findOne({ where: { id: id } });
    }

    updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
        return this.menuRepository.update(id, updateMenuDto);
    }

    removeMenu(id: number) {
        return this.menuRepository.delete(id);
    }

    // CRUD Ingredients
    createIngredient(createIngredientDto: CreateIngredientDto) {
        const newIngredient = this.ingredientRepository.create(createIngredientDto);
        return this.ingredientRepository.save(newIngredient);
    }

    findAllIngredients() {
        return this.ingredientRepository.find();
    }

    findOneIngredient(id: number) {
        return this.ingredientRepository.findOne({ where: { id: id } });
    }

    updateIngredient(id: number, updateIngredientDto: UpdateIngredientDto) {
        return this.ingredientRepository.update(id, updateIngredientDto);
    }

    removeIngredient(id: number) {
        return this.ingredientRepository.delete(id);
    }

    // CRUD Utilisateurs
    createUser(createUserDto: CreateUserDto) {
        const newUser = this.utilisateurRepository.create(createUserDto);
        return this.utilisateurRepository.save(newUser);
    }

    findAllUsers() {
        return this.utilisateurRepository.find({ relations: ['role'] });
    }

    findOneUser(id: string) {
        return this.utilisateurRepository.findOne({ where: { id: id }, relations: ['role'] });
    }

    updateUser(id: number, updateUserDto: UpdateUserDto) {
        return this.utilisateurRepository.update(id, updateUserDto);
    }

    removeUser(id: number) {
        return this.utilisateurRepository.delete(id);
    }


    async createAbonnement(data: Partial<Abonnements>): Promise<Abonnements> {
        const newAbonnement = this.abonnementsRepository.create(data);
        return this.abonnementsRepository.save(newAbonnement);
    }

    async findAllAbonnements(): Promise<Abonnements[]> {
        return this.abonnementsRepository.find({ relations: ['client'], });
    }

    async findOneAbonnement(id: string): Promise<Abonnements | null> {
        return this.abonnementsRepository.findOne({ where: { id } });
    }

    async updateAbonnement(id: string, data: Partial<Abonnements>): Promise<Abonnements> {
        await this.abonnementsRepository.update(id, data);
        return this.findOneAbonnement(id);
    }

    async removeAbonnement(id: string): Promise<void> {
        await this.abonnementsRepository.delete(id);
    }

     async getAllTypesAbonnement(): Promise<TypesAbonnement[]> {
    return await this.typeAbonnementRepo.find({
      where: { deletedAt: null },
      order: { createdAt: 'DESC' },
    });
  }

  async getTypeAbonnementById(id: number): Promise<TypesAbonnement> {
    return await this.typeAbonnementRepo.findOneByOrFail({ id });
  }

  async createTypeAbonnement(data: Partial<TypesAbonnement>): Promise<TypesAbonnement> {
    const newType = this.typeAbonnementRepo.create(data);
    return await this.typeAbonnementRepo.save(newType);
  }

  async updateTypeAbonnement(id: number, data: Partial<TypesAbonnement>): Promise<TypesAbonnement> {
    const type = await this.getTypeAbonnementById(id);
    Object.assign(type, data);
    return await this.typeAbonnementRepo.save(type);
  }

  async deleteTypeAbonnement(id: number): Promise<void> {
    await this.typeAbonnementRepo.update(id, { deletedAt: new Date() });
  }

  // MenuTypeAbonnement
  async getMenusForTypeAbonnement(typeAbonnementId: number) {
    const allMenus = await this.menusRepository.find();
    const inclus = await this.menuTypeAbonnementRepository.findBy({ typeAbonnementId });

    const inclusMap = new Map<number, MenuTypeAbonnement>();
    inclus.forEach((mta) => inclusMap.set((mta as any).menuId, mta));

    return allMenus.map((menu) => ({
      ...menu,
      inclus: inclusMap.has(menu.id),
    }));
  }

async updateMenusForTypeAbonnement(typeAbonnementId: number, menuIds: number[]) {
  // Supprimer toutes les entrées précédentes liées à ce type d'abonnement
  await this.menuTypeAbonnementRepository
    .createQueryBuilder()
    .delete()
    .where("type_abonnement_id = :id", { id: typeAbonnementId })
    .execute();

  // Recréer les liaisons
  const typeAbonnement = await this.typeAbonnementRepo.findOneBy({ id: typeAbonnementId });

  const insertData = await Promise.all(
    menuIds.map(async (menuId) => {
      const item = new MenuTypeAbonnement();
      item.typeAbonnement = typeAbonnement;
      item.typeAbonnementId = typeAbonnement.id;
      const menu = await this.menuRepository.findOneBy({ id: menuId }); 
      item.menu = menu;
      item.menuId = menu.id;
      return item;
    })
  );

  return this.menuTypeAbonnementRepository.save(insertData);
}


  // AccompagnementTypeAbonnement
  async getAccompagnementsForTypeAbonnement(typeAbonnementId: number) {
    const allAccompagnements = await this.accompagnementsRepository.find();
    const inclus = await this.accompagnementTypeAbonnementRepository.find({
      where: { typeAbonnement: { id: typeAbonnementId } },
      relations: ['accompagnement'],
    });

    const inclusMap = new Map<number, AccompagnementTypeAbonnement>();
    for (const ata of inclus) {
      const acc = await ata.accompagnement;
      inclusMap.set(acc.id, ata);
    }

    return allAccompagnements.map((acc) => ({
      ...acc,
      inclus: inclusMap.has(acc.id),
    }));
  }

async updateAccompagnementsForTypeAbonnement(typeAbonnementId: number, accompagnementIds: number[]) {
  await this.accompagnementTypeAbonnementRepository
    .createQueryBuilder()
    .delete()
    .where("type_abonnement_id = :id", { id: typeAbonnementId })
    .execute();

  const typeAbonnement = await this.typeAbonnementRepo.findOneBy({ id: typeAbonnementId });

  const insertData = await Promise.all(
    accompagnementIds.map(async (accId) => {
      const item = new AccompagnementTypeAbonnement();
      item.typeAbonnement = Promise.resolve(typeAbonnement);
      item.typeAbonnementId = typeAbonnement.id;
      const accompagnement = await this.accompagnementsRepository.findOneBy({ id: accId }); 
      item.accompagnement = Promise.resolve(accompagnement);
      item.accompagnementId = accompagnement.id;
      return item;
    })
  );

  return this.accompagnementTypeAbonnementRepository.save(insertData);
}

async getAllBonsCommande(): Promise<BonsCommande[]> {
  return this.bonsCommandeRepository.find({
    relations: ['abonnement', 'abonnement.client'],
    order: { createdAt: 'DESC' }
  });
}

async filterBonsCommande(options: {
  clientId?: string;
  dateDebut?: string;
  dateFin?: string;
}): Promise<BonsCommande[]> {
  const { clientId, dateDebut, dateFin } = options;

  const query = this.bonsCommandeRepository
    .createQueryBuilder('bon')
    .leftJoinAndSelect('bon.abonnement', 'abonnement')
    .leftJoinAndSelect('abonnement.client', 'client')
    .orderBy('bon.createdAt', 'DESC');

  if (clientId) {
    query.andWhere('abonnement.clientId = :clientId', { clientId });
  }

  if (dateDebut) {
    query.andWhere('bon.semaineDebut >= :dateDebut', { dateDebut });
  }

  if (dateFin) {
    query.andWhere('bon.semaineFin <= :dateFin', { dateFin });
  }

  return await query.getMany();
}

async getBonsCommandeNonValides(): Promise<BonsCommande[]> {
  return this.bonsCommandeRepository.find({
    where: { statut: 'EN_ATTENTE' },
    relations: ['abonnement', 'abonnement.client'],
    order: { createdAt: 'DESC' }
  });
}

async getBonCommandeDetails(id: string): Promise<BonsCommande> {
  return this.bonsCommandeRepository.findOne({
    where: { id },
    relations: [
      'abonnement',
      'abonnement.client',
      'selectionsHebdomadaires',
      'selectionsHebdomadaires.menu',
      'selectionsHebdomadaires.accompagnement'
    ]
  });
}

async updateStatutBonCommande(id: string, statut: 'VALIDE' | 'TRAITE' | 'REFUSE'): Promise<void> {
  await this.bonsCommandeRepository.update(id, { statut });
}

async getBonCommandeById(id: string) {
  return this.bonsCommandeRepository.findOne({
    where: { id },
    relations: {
      abonnement: {
        client: true,
        typeAbonnement: true,
      },
      selectionsHebdomadaires: {
        menu: true,
        accompagnement: true,
      },
    },
  });
}


}
