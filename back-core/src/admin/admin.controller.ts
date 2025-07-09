import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAbonnementDto, UpdateAbonnementDto } from './dto/create-abonnement.dto';
import { TypesAbonnement } from '../entities/TypesAbonnement';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    // ... existing endpoints

    @Get('commandes/statuts')
    // Vous pouvez aussi appliquer le Guard uniquement sur cette route si nécessaire
    // @UseGuards(AdminRoleGuard) 
    async getOrderStatusSummary() {
      return this.adminService.getOrderStatusSummary();
    }

    @Get('commandes/historique')
    async getCommandesHistory() {
        return this.adminService.getCommandesHistory();
    }


    @Get('commandes/bonsCommandes')
    async getBonsCommandes() {
        return this.adminService.getBonsCommandes();
    }

    @Get('stats/chiffres-affaire')
    async getChiffreAffaires(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getChiffreAffaires(dateDebut,dateFin);
    }

    @Get('stats/chiffres-affaire/journalier')
    async getChiffreAffaireJournalier(@Query('date') date?: string) {
        let d: Date;
        if (date) {
            d = new Date(date);
        } else {
            d = new Date();
        }
        // Correction : forcer le format YYYY-MM-DD
        const dateStr = d.toISOString().slice(0, 10);
        return this.adminService.getChiffreAffaireJournalier(new Date(dateStr));
    }

    @Get('commandes/en-cours/nb')
    async getNombreCommandeEnCours(@Query('dateDebut') dateDebut: string, @Query('dateFin') dateFin: string) {
        return this.adminService.getNombreCommandeEnCours(dateDebut, dateFin);
    }
    
    @Get('stats/top/menus')
    async getTopMenu() {
        return this.adminService.getTopMenu();
    }

    @Get('stats/total-depense')
    async getTotalDepenses(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getTotalDepenses(dateDebut,dateFin);
    }

    @Get('stats/top/clients/individuel')
    async getTopClientsIndividuels(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getTopClientsIndividuels(dateDebut,dateFin);
    }

    @Get('stats/top/clients/entreprise')
    async getTopClientsEntreprises(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getTopClientsEntreprises(dateDebut,dateFin);
    }

    @Get('factures/individuelles')
    async getFacturesIndividuelles(@Query('dateDebut') dateDebut?: Date  //  Avec les details
                                , @Query('dateFin') dateFin?: Date
                                , @Query('clientId') clientId?: string) {
        return this.adminService.getFacturesIndividuelles(dateDebut,dateFin,clientId);  
    }

    @Get('factures/entreprises')
    async getFacturesEntreprises(@Query('dateDebut') dateDebut?: Date    //  Avec les details
                                , @Query('dateFin') dateFin?: Date
                                , @Query('clientId') clientId?: string) {
        return this.adminService.getFacturesEntreprises(dateDebut,dateFin,clientId);
    }

    @Get('commandes')
    async getCommande(@Query('commandeId') commandeId: string) {
        return this.adminService.getCommandeDetails(commandeId);
    }

    @Post('menu/validate')
    async validateMenu(@Query('menuId') menuId: number) {
        return this.adminService.validateMenu(menuId);
    }

    @Get('stock/mouvement')
    async getMouvementStock(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getMouvementStock(dateDebut,dateFin);
    }

    // CRUD Menus
    @Post('menus')
    @UsePipes(new ValidationPipe())
    createMenu(@Body() createMenuDto: CreateMenuDto) {
        return this.adminService.createMenu(createMenuDto);
    }

    @Get('menus')
    findAllMenus() {
        return this.adminService.findAllMenus();
    }

    @Get('menus/:id')
    findOneMenu(@Param('id') id: string) {
        return this.adminService.findOneMenu(+id);
    }

    @Patch('menus/:id')
    @UsePipes(new ValidationPipe())
    updateMenu(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
        return this.adminService.updateMenu(+id, updateMenuDto);
    }

    @Delete('menus/:id')
    removeMenu(@Param('id') id: string) {
        return this.adminService.removeMenu(+id);
    }

    // CRUD Ingredients
    @Post('ingredients')
    @UsePipes(new ValidationPipe())
    createIngredient(@Body() createIngredientDto: CreateIngredientDto) {
        return this.adminService.createIngredient(createIngredientDto);
    }

    @Get('ingredients')
    findAllIngredients() {
        return this.adminService.findAllIngredients();
    }

    @Get('ingredients/:id')
    findOneIngredient(@Param('id') id: string) {
        return this.adminService.findOneIngredient(+id);
    }

    @Patch('ingredients/:id')
    @UsePipes(new ValidationPipe())
    updateIngredient(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
        return this.adminService.updateIngredient(+id, updateIngredientDto);
    }

    @Delete('ingredients/:id')
    removeIngredient(@Param('id') id: string) {
        return this.adminService.removeIngredient(+id);
    }

    // CRUD Utilisateurs
    @Post('users')
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.adminService.createUser(createUserDto);
    }

    @Get('users')
    findAllUsers() {
        return this.adminService.findAllUsers();
    }

    @Get('users/:id')
    findOneUser(@Param('id') id: string) {
        return this.adminService.findOneUser(id);
    }

    @Patch('users/:id')
    @UsePipes(new ValidationPipe())
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.adminService.updateUser(+id, updateUserDto);
    }

    @Delete('users/:id')
    removeUser(@Param('id') id: string) {
        return this.adminService.removeUser(+id);
    }

    @Post('abonnements')
    @UsePipes(new ValidationPipe())
    createAbonnement(@Body() createAbonnementDto: CreateAbonnementDto) {
        return this.adminService.createAbonnement(createAbonnementDto);
    }

    @Get('abonnements')
    async findAllAbonnements() {
        const abn = await this.adminService.findAllAbonnements();
        return abn;
    }

    @Get('abonnements/:id')
    findOneAbonnement(@Param('id') id: string) {
        return this.adminService.findOneAbonnement(id);
    }

    @Patch('abonnements/:id')
    @UsePipes(new ValidationPipe())
    updateAbonnement(@Param('id') id: string, @Body() updateAbonnementDto: UpdateAbonnementDto) {
        return this.adminService.updateAbonnement(id, updateAbonnementDto);
    }

    @Delete('abonnements/:id')
    removeAbonnement(@Param('id') id: string) {
        return this.adminService.removeAbonnement(id);
    }

  @Get('types-abonnement')
  getAllTypesAbonnement(): Promise<TypesAbonnement[]> {
    return this.adminService.getAllTypesAbonnement();
  }

  @Get('types-abonnement/:id')
  getTypeAbonnementById(@Param('id') id: number): Promise<TypesAbonnement> {
    return this.adminService.getTypeAbonnementById(id);
  }

  @Post('types-abonnement')
  createTypeAbonnement(@Body() body: Partial<TypesAbonnement>): Promise<TypesAbonnement> {
    return this.adminService.createTypeAbonnement(body);
  }

  @Put('types-abonnement/:id')
  updateTypeAbonnement(@Param('id') id: number, @Body() body: Partial<TypesAbonnement>) {
    return this.adminService.updateTypeAbonnement(id, body);
  }

  @Delete('types-abonnement/:id')
  deleteTypeAbonnement(@Param('id') id: number): Promise<void> {
    return this.adminService.deleteTypeAbonnement(id);
  }

  @Get('types-abonnement/:id/menus')
  getMenusForTypeAbonnement(@Param('id') id: number) {
    return this.adminService.getMenusForTypeAbonnement(id);
  }

  @Post('types-abonnement/:id/menus')
  updateMenusForTypeAbonnement(@Param('id') id: number, @Body() body: { menuIds: number[] }) {
    return this.adminService.updateMenusForTypeAbonnement(id, body.menuIds);
  }

  @Get('types-abonnement/:id/accompagnements')
  getAccompagnementsForTypeAbonnement(@Param('id') id: number) {
    return this.adminService.getAccompagnementsForTypeAbonnement(id);
  }

  @Post('types-abonnement/:id/accompagnements')
  updateAccompagnementsForTypeAbonnement(@Param('id') id: number, @Body() body: { accompagnementIds: number[] }) {
    return this.adminService.updateAccompagnementsForTypeAbonnement(id, body.accompagnementIds);
  }

@Get('bons-commande')
async getAllBonsCommande() {
  return this.adminService.getAllBonsCommande();
}

@Post('bons-commande/filtrer')
async filterBonsCommande(@Body() body: {
  clientId?: string;
  dateDebut?: string;
  dateFin?: string;
}) {
  return this.adminService.filterBonsCommande(body);
}

@Get('bons-commande/non-valides')
async getBonsCommandeNonValides() {
  return this.adminService.getBonsCommandeNonValides();
}

@Get('bons-commande/:id')
async getBonCommandeDetails(@Param('id') id: string) {
  return this.adminService.getBonCommandeDetails(id);
}

@Patch('bons-commande/:id/statut')
async updateBonCommandeStatut(
  @Param('id') id: string,
  @Body() body: { statut: 'VALIDE' | 'TRAITE' | 'REFUSE' }
) {
  return this.adminService.updateStatutBonCommande(id, body.statut);
}

@Get('bons-commande/:id')
getBonCommande(@Param('id') id: string) {
  return this.adminService.getBonCommandeById(id);
}


}