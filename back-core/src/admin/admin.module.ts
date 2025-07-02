import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Roles } from '../entities/Roles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { HistoriqueCommandesView } from '../entities/historique-commandes-view.entity';
import { BonsCommande } from '../entities/BonsCommande';
import { PaiementsIndividuels } from '../entities/PaiementsIndividuels';
import { PaiementsEntreprises } from '../entities/PaiementsEntreprises';
import { Salaires } from '../entities/Salaires';
import { Ingredients } from '../entities/Ingredients';
import { FacturesIndividuelles } from '../entities/FacturesIndividuelles';
import { FacturesEntreprises } from '../entities/FacturesEntreprises';
import { Menus } from '../entities/Menus';
import { MouvementsStock } from '../entities/MouvementsStock';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, CommandeStatutView, HistoriqueCommandesView, BonsCommande, PaiementsIndividuels, PaiementsEntreprises, Salaires, Ingredients, FacturesIndividuelles, FacturesEntreprises, Menus, MouvementsStock])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
