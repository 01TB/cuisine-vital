import { BadRequestException, Body, Controller, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { LivreurService } from './livreur.service';
import { CommandeType } from './enums/commande-type.enum';


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
}
