import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { LivreurService } from './livreur.service';

@Controller('livreurs') // J'ai renommé en 'livreurs' au pluriel, c'est une convention REST
export class LivreurController {
  constructor(private readonly livreurService: LivreurService) {}

  /**
   * GET /livreurs/:livreurId/commandes-a-livrer
   *
   * Récupère la liste des commandes à livrer pour un livreur spécifique.
   * @param livreurId - L'ID (UUID) du livreur.
   */
  @Get(':livreurId/commandes-a-livrer')
  async getCommandesALivrer(
    @Param('livreurId', ParseUUIDPipe) livreurId: string,
  ) {
    // Le ParseUUIDPipe valide automatiquement que le paramètre est bien un UUID.
    return this.livreurService.getCommandesALivrer(livreurId);
  }
}