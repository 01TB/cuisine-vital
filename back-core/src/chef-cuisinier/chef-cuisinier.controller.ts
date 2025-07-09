import { Controller, Get } from '@nestjs/common';
import { ChefCuisinierService } from './chef-cuisinier.service';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';
import { CommandesEntreprises } from 'src/entities/CommandesEntreprises';

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
}
