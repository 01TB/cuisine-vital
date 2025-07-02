import { Controller, Get, Query } from '@nestjs/common';
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
    

}
