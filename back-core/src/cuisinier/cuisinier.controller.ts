import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { CuisinierService } from './cuisinier.service';
import { CommandeType } from './enums/commande-type.enum';

@Controller('cuisinier')
export class CuisinierController {
    constructor(
        private readonly commandeService: CuisinierService
    ) { }

    @Get('commandes/statuts')
    findCommandeIndividuelle() {
        return this.commandeService.findCommandeStatus();
    }


    @Post('commandes/:id/validation')
    validationCommande(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('type') type: CommandeType,
        @Body() body: { statutId: number },
    ) {
        const { statutId } = body;

        if (!type || !Object.values(CommandeType).includes(type)) {
            throw new BadRequestException("Le paramètre de requête 'type' est manquant ou invalide. Les valeurs acceptées sont 'individuelle' ou 'entreprise'.");
        }

        if (statutId === undefined || typeof statutId !== 'number') {
            throw new BadRequestException("La propriété 'statutId' est manquante ou n'est pas un nombre.");
        }

        return this.commandeService.validationCommande(id, type, statutId);
    }


    @Get('commandes/historique')
    getHistoriqueComplet() {
        return this.commandeService.findHistoriqueComplet();
    }

}

