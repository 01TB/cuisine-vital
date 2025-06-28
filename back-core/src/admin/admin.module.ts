import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Roles } from '../entities/Roles';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { HistoriqueCommandesView } from '../entities/historique-commandes-view.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Roles, CommandeStatutView, HistoriqueCommandesView])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
