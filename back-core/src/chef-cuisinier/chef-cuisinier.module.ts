import { Module } from '@nestjs/common';
import { ChefCuisinierController } from './chef-cuisinier.controller';
import { ChefCuisinierService } from './chef-cuisinier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { StatutsCommande } from '../entities/StatutsCommande';
import { Menus } from '../entities/Menus';
import { Recettes } from '../entities/Recettes';
import { Ingredients } from '../entities/Ingredients';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandesIndividuelles,
      CommandesEntreprises,
      StatutsCommande,
      Menus,
      Recettes,
      Ingredients,
    ]),
  ],
  controllers: [ChefCuisinierController],
  providers: [ChefCuisinierService],
})
export class ChefCuisinierModule {}
