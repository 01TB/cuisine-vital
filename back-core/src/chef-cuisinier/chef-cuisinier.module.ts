import { Module } from '@nestjs/common';
import { ChefCuisinierController } from './chef-cuisinier.controller';
import { ChefCuisinierService } from './chef-cuisinier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';
import { CommandesEntreprises } from 'src/entities/CommandesEntreprises';
import { StatutsCommande } from 'src/entities/StatutsCommande';
import { Menus } from 'src/entities/Menus';
import { Recettes } from 'src/entities/Recettes';
import { Ingredients } from 'src/entities/Ingredients';

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
