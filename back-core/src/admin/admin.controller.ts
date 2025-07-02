import { Controller, Get, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {

    }

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

}