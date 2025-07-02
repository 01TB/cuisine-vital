import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

    @Get('commandes/en-cours/nb')
    async getNombreCommandeEnCours(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getNombreCommandeEnCours(dateDebut,dateFin);
    }
    
    @Get('stats/top/menus')
    async getTopMenu(@Query('dateDebut') dateDebut: Date, @Query('dateFin') dateFin: Date) {
        return this.adminService.getTopMenu(dateDebut,dateFin);
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
}