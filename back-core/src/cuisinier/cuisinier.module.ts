import { Module } from '@nestjs/common';
import { CuisinierController } from './cuisinier.controller';
import { CuisinierService } from './cuisinier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandeHistoriqueView } from '../entities/commande-historique.view.entity';
import { Menus } from '../entities/Menus';
import { Recettes } from '../entities/Recettes';
import { Ingredients } from '../entities/Ingredients';

@Module({
  imports: [TypeOrmModule.forFeature([CommandeStatutView, CommandesEntreprises,
    CommandesIndividuelles, CommandeHistoriqueView,
    Menus,
    Recettes,
    Ingredients,
  ])],
  controllers: [CuisinierController],
  providers: [CuisinierService],
  exports: [CuisinierService]
})
export class CuisinierModule { }
