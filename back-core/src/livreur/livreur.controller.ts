import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LivreurService } from './livreur.service';

@Controller('livreurs')
export class LivreurController {
  constructor(private readonly livreurService: LivreurService) {}

  /**
   * GET /livreurs/:livreurId/commandes-a-livrer
   *
   * Récupère la liste des commandes prêtes à être livrées pour un livreur.
   * @param livreurId - L'ID (UUID) du livreur.
   */
  @Get(':livreurId/commandes-a-livrer')
  async getCommandesALivrer(
    @Param('livreurId', ParseUUIDPipe) livreurId: string,
  ) {
    return this.livreurService.getCommandesALivrer(livreurId);
  }

  /**
   * NOUVEL ENDPOINT
   * GET /livreurs/:livreurId/commandes-en-cours
   *
   * Récupère la liste des commandes en cours de livraison pour un livreur.
   * @param livreurId - L'ID (UUID) du livreur.
   */
  @Get(':livreurId/commandes-en-cours')
  async getCommandesEnCours(
    @Param('livreurId', ParseUUIDPipe) livreurId: string,
  ) {
    return this.livreurService.getCommandesEnCours(livreurId);
  }
}