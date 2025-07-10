import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LivreurService } from './livreur.service';
import { Utilisateurs } from '../entities/Utilisateurs';

@Controller('livreurs')
export class LivreurController {

    constructor(private readonly livreurService: LivreurService) { }

    @Get()
    async getAllLivreurs(): Promise<Utilisateurs[]> {
        return this.livreurService.getAllLivreurs();
    }

    @Get('livraisons/all')
    async getAllLivraisonsAll(): Promise<any> {
        return this.livreurService.getAllLivraisons();
    }

    @Get(':livreurId/livraisons')
    async getLivraisonsPourLivreur(
        @Param('livreurId', ParseUUIDPipe) livreurId: string
    ): Promise<any> {
        return this.livreurService.getLivraisonsPourLivreur(livreurId);
    }


    @Get(':livreurId/itineraire')
    async getItinerairePourLivreur(
        @Param('livreurId', ParseUUIDPipe) livreurId: string
    ): Promise<any> {
        return this.livreurService.getItinerairePourLivreur(livreurId);
    }
}