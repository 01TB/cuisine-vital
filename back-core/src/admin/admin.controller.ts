import { Controller , Get } from '@nestjs/common';
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



}
