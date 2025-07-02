// src/commandes/commandes.controller.ts
import { Controller, Get, Patch, Param, Body, ParseUUIDPipe } from '@nestjs/common';
import { CommandesService } from './commandes.service';

// On préfixe toutes les routes de ce contrôleur par /api/commandes
@Controller('api/commandes')
export class CommandesController {
  constructor(private readonly commandesService: CommandesService) {}

  @Get()
  listerToutesLesCommandes() {
    return this.commandesService.findAll();
  }

  @Get('statuts')
  listerTousLesStatuts() {
    return this.commandesService.findAllStatuts();
  }

  @Patch(':type/:id/statut')
  mettreAJourLeStatut(
    @Param('type') type: 'individuelle' | 'entreprise',
    @Param('id', ParseUUIDPipe) id: string,
    @Body('statutId') statutId: number,
  ) {
    // On pourrait ajouter un DTO ici pour la validation, mais gardons simple pour l'instant.
    return this.commandesService.updateStatusCommande(type, id, statutId);
  }
}