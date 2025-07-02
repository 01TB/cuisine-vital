// src/commandes/commandes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';

// Importez les entités dont nous aurons besoin
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { StatutsCommande } from '../entities/StatutsCommande';
import { Clients } from '../entities/Clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandesIndividuelles,
      CommandesEntreprises,
      StatutsCommande,
      Clients, // Nécessaire pour les relations
    ]),
  ],
  providers: [CommandesService],
  controllers: [CommandesController],
})
export class CommandesModule {}