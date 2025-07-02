import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { LivreurService } from './livreur.service';
import { CommandeType, StatutLivraison } from './enums/commande-type.enum';


@Controller('livreur')
export class LivreurController {

    constructor(private readonly livreurService: LivreurService) { }


    @Post('commandes/:commandeId/statut')
    updateCommandeStatut(
        @Param('commandeId', ParseUUIDPipe) commandeId: string,
        @Query('type') type: CommandeType,
        @Body() body: { statutId: number },
    ) {
        const { statutId } = body;

        if (!type || !Object.values(CommandeType).includes(type)) {
            throw new BadRequestException("Le paramètre de requête 'type' est manquant ou invalide.");
        }

        if (statutId === undefined || typeof statutId !== 'number') {
            throw new BadRequestException("La propriété 'statutId' est manquante ou n'est pas un nombre.");
        }

        return this.livreurService.updateCommandeStatut(commandeId, type, statutId);
    }

    @Get('livraisons')
    getAllLivraisons() {
        return this.livreurService.getAllLivraisons();
    }

    
    @Get()
    getAllLivreurs() {
        return this.livreurService.getAllLivreurs();
    }

    @Post('livraisons/:livraisonId/confirmer')
    confirmerLivraison(
        @Param('livraisonId', ParseUUIDPipe) livraisonId: string,
        @Query('type') type: CommandeType,
        @Body() body: { statut: StatutLivraison },
    ) {
        const { statut } = body;

        if (!type || !Object.values(CommandeType).includes(type)) {
            throw new BadRequestException("Le paramètre de requête 'type' est manquant ou invalide.");
        }
        
        if (!statut || !Object.values(StatutLivraison).includes(statut)) {
            throw new BadRequestException(`La propriété 'statut' est manquante ou doit être une des valeurs suivantes : '${StatutLivraison.EN_LIVRAISON}', '${StatutLivraison.LIVREE}'.`);
        }

        return this.livreurService.confirmerLivraison(livraisonId, type, statut);
    }

    @Get(':livreurId/itineraire')
    getItinerairePourLivreur(
        @Param('livreurId', ParseUUIDPipe) livreurId: string,
    ) {
        return this.livreurService.getItinerairePourLivreur(livreurId);
    }
}
