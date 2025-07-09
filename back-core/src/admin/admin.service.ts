import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../entities/Roles';
import { DataSource, MoreThan, Repository } from 'typeorm';
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
import { ExemplairesIngredient } from '../entities/ExemplairesIngredient';
import { CreateStockEntryDto, UseStockDto } from './dto/stock.dto';

@Injectable()
export class AdminService {
    constructor(
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

        @InjectRepository(ExemplairesIngredient)
        private exemplairesRepository: Repository<ExemplairesIngredient>,
        
        private dataSource: DataSource,

    ){}

    // ... Méthodes existantes ...
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
    
    async getNombreCommandeEnCours(dateDebut: string, dateFin: string) {
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

    // =============================================
    // GESTION FINE DU STOCK (NOUVELLE IMPLEMENTATION)
    // =============================================

    /**
     * Récupère l'état de tous les stocks en une seule requête optimisée.
     */
    async getStockOverview() {
        const results = await this.ingredientRepository.createQueryBuilder('i')
            .select('i.id', 'id')
            .addSelect('i.nom', 'nom')
            .addSelect('i.unite_mesure', 'unite_mesure')
            .addSelect('i.stock_minimum', 'stock_minimum')
            .addSelect((subQuery) => {
                return subQuery
                    .select('COALESCE(SUM(ex.quantite), 0)', 'total')
                    .from(ExemplairesIngredient, 'ex')
                    .where('ex.ingredient_id = i.id')
                    .andWhere('(ex.date_peremption IS NULL OR ex.date_peremption > CURRENT_DATE)');
            }, 'stockActuel')
            .where('i.actif = true')
            .groupBy('i.id')
            .orderBy('i.nom', 'ASC')
            .getRawMany();
        
        // Conversion des résultats bruts en nombres
        return results.map(r => ({
            ...r,
            stock_minimum: parseFloat(r.stock_minimum),
            stockActuel: parseFloat(r.stockActuel)
        }));
    }

    /**
     * Calcule le stock actuel pour un ingrédient spécifique.
     */
    private async getIngredientCurrentStock(ingredientId: number): Promise<number> {
        const result = await this.exemplairesRepository.createQueryBuilder('ex')
            .select('SUM(ex.quantite)', 'total')
            .where('ex.ingredient_id = :ingredientId', { ingredientId })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }

    /**
     * Ajoute une entrée de stock en utilisant directement les repositories.
     */
    async addStockEntry(dto: CreateStockEntryDto, utilisateur: Utilisateurs) {
        const { ingredientId, quantite, datePeremption, prixUnitaireAchat } = dto;

        const ingredient = await this.ingredientRepository.findOneBy({ id: ingredientId });
        if (!ingredient) {
            throw new NotFoundException(`Ingrédient avec l'ID ${ingredientId} non trouvé.`);
        }

        const stockAvant = await this.getIngredientCurrentStock(ingredientId);

        const nouvelExemplaire = this.exemplairesRepository.create({
            ingredient: ingredient,
            quantite: quantite,
            datePeremption: datePeremption ? new Date(datePeremption) : undefined,
        });
        const savedExemplaire = await this.exemplairesRepository.save(nouvelExemplaire);

        const mouvement = this.mouvementStockRepository.create({
            exemplaireIngredient: savedExemplaire,
            typeMouvement: 'ENTREE',
            quantite: quantite,
            stockAvant: stockAvant,
            stockApres: stockAvant + quantite,
            commentaire: `Achat - Prix unitaire: ${prixUnitaireAchat}`,
            utilisateur: utilisateur,
        });
        await this.mouvementStockRepository.save(mouvement);

        return savedExemplaire;
    }

    /**
     * Utilise du stock avec une logique FIFO et des appels directs au repository.
     */
    async useStock(dto: UseStockDto, utilisateur: Utilisateurs) {
        const { ingredientId, quantite } = dto;

        const ingredient = await this.ingredientRepository.findOneBy({ id: ingredientId });
        if (!ingredient) {
            throw new NotFoundException(`Ingrédient avec l'ID ${ingredientId} non trouvé.`);
        }

        const stockActuel = await this.getIngredientCurrentStock(ingredientId);
        if (stockActuel < quantite) {
            throw new BadRequestException(`Stock insuffisant pour ${ingredient.nom}. Actuel: ${stockActuel}, Demandé: ${quantite}`);
        }

        const exemplairesDisponibles = await this.exemplairesRepository.find({
            where: { ingredient: ingredient, quantite: MoreThan(0) },
            order: { datePeremption: 'ASC' }, // FIFO: les plus anciens (ou sans date) d'abord
        });

        let quantiteRestanteADeduire = quantite;
        for (const exemplaire of exemplairesDisponibles) {
            if (quantiteRestanteADeduire <= 0) break;

            const quantiteAPrendre = Math.min(exemplaire.quantite, quantiteRestanteADeduire);
            exemplaire.quantite -= quantiteAPrendre;
            quantiteRestanteADeduire -= quantiteAPrendre;

            await this.exemplairesRepository.save(exemplaire); // Sauvegarde chaque exemplaire modifié
        }

        const mouvement = this.mouvementStockRepository.create({
            typeMouvement: 'SORTIE',
            quantite: quantite,
            stockAvant: stockActuel,
            stockApres: stockActuel - quantite,
            commentaire: 'Utilisation pour production',
            utilisateur: utilisateur,
            // On ne lie pas à un exemplaire car plusieurs peuvent être impactés
        });
        await this.mouvementStockRepository.save(mouvement);

        return { message: `Stock de ${ingredient.nom} mis à jour avec succès.` };
    }

    /**
     * Récupère un historique de stock enrichi avec les informations de l'utilisateur.
     */
    async getStockHistory(ingredientId: number) {
        const ingredient = await this.ingredientRepository.findOneBy({ id: ingredientId });
        if (!ingredient) {
            throw new NotFoundException(`Ingrédient avec l'ID ${ingredientId} non trouvé.`);
        }

        return this.mouvementStockRepository.createQueryBuilder('mvt')
            .leftJoin('mvt.exemplaire_ingredient_id', 'ex') // <-- Utilisez le bon nom de relation
            .leftJoinAndSelect('mvt.utilisateurs', 'u')
            .select([
                'mvt.id',
                'mvt.created_at',
                'mvt.type_mouvement',
                'mvt.quantite',
                'mvt.stock_avant',
                'mvt.stock_apres',
                'mvt.commentaire',
                'u.nom',
                'u.prenom',
                'ex.id' // Ajouté pour référence
            ])
            .where('ex.exemplaire_ingredient_id = :ingredientId', { ingredientId })
            .orderBy('mvt.created_at', 'DESC')
            .getMany();
    }
}

