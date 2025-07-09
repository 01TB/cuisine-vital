import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ChefCuisinierService } from './chef-cuisinier.service';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';
import { CommandesEntreprises } from 'src/entities/CommandesEntreprises';
import { UpdateCommandeStatutDto } from './dto/update-commande-statut.dto';

@Controller('chef-cuisinier')
export class ChefCuisinierController {
  constructor(private readonly chefCuisinierService: ChefCuisinierService) {}

  @Get('commandes/individuelles/en-cours')
  getCommandesIndividuellesEnCours(): Promise<CommandesIndividuelles[]> {
    return this.chefCuisinierService.findCommandesIndividuellesEnCours();
  }

  @Get('commandes/entreprises/en-cours')
  getCommandesEntreprisesEnCours(): Promise<CommandesEntreprises[]> {
    return this.chefCuisinierService.findCommandesEntreprisesEnCours();
  }

//   La logique de mise à jour est centralisée ici pour être réutilisable et robuste.
//    - Injection de `StatutsCommandeRepository`: Le service a maintenant accès à la table des statuts pour la validation.
//    - Méthode privée `updateStatut<T>()`:
//        - C'est une méthode générique conçue pour fonctionner avec les deux types de commandes (CommandesIndividuelles et CommandesEntreprises) afin d'éviter la duplication de code.
//        - Validation 1 : Elle vérifie d'abord si le statutId fourni dans le DTO correspond à un statut qui existe réellement dans la base de données. Si ce n'est pas le cas, elle lance une erreur
//          BadRequestException.
//        - Validation 2 : Elle vérifie ensuite si la commande que l'on essaie de modifier existe bien. Si non, elle lance une erreur NotFoundException.
//        - Mise à jour : Si les deux validations réussissent, elle assigne le nouvel statutId à la commande et la sauvegarde en base de données.
//    - Méthodes publiques `updateCommande...Statut()`:
//        - Ces deux méthodes (updateCommandeIndividuelleStatut et updateCommandeEntrepriseStatut) sont les points d'entrée publics.
//        - Leur seul rôle est d'appeler la méthode privée updateStatut en lui passant le bon Repository (celui des commandes individuelles ou celui des entreprises).

  @Patch('commandes/individuelles/:id/statut')
  updateCommandeIndividuelleStatut(
    @Param('id') id: string,
    @Body() dto: UpdateCommandeStatutDto,
  ): Promise<CommandesIndividuelles> {
    return this.chefCuisinierService.updateCommandeIndividuelleStatut(id, dto);
  }

  @Patch('commandes/entreprises/:id/statut')
  updateCommandeEntrepriseStatut(
    @Param('id') id: string,
    @Body() dto: UpdateCommandeStatutDto,
  ): Promise<CommandesEntreprises> {
    return this.chefCuisinierService.updateCommandeEntrepriseStatut(id, dto);
  }
}
