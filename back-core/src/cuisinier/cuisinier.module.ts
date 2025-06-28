import { Module } from '@nestjs/common';
import { CuisinierController } from './cuisinier.controller';
import { CuisinierService } from './cuisinier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { Clients } from '../entities/Clients';
import { Utilisateurs } from '../entities/Utilisateurs';
import { StatutsCommande } from '../entities/StatutsCommande';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandesIndividuelles,
      Clients,
      Utilisateurs,
      StatutsCommande
    ])
  ],
  controllers: [CuisinierController],
  providers: [CuisinierService],
  exports:[CuisinierService]
})
export class CuisinierModule {}
