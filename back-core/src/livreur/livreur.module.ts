import { Module } from '@nestjs/common';
import { LivreurService } from './livreur.service';
import { LivreurController } from './livreur.controller';
import { OsrmModule } from '../osrm/osrm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesLivraison } from '../entities/ZonesLivraison';
import { LivraisonsIndividuelles } from '../entities/LivraisonsIndividuelles';
import { LivraisonsEntreprises } from '../entities/LivraisonsEntreprises';
import { Utilisateurs } from '../entities/Utilisateurs';

@Module({
  imports: [
    OsrmModule,
    TypeOrmModule.forFeature([ 
      ZonesLivraison,
      LivraisonsIndividuelles,
      LivraisonsEntreprises,
      Utilisateurs,
    ]), 
  ], 
  controllers: [LivreurController],
  providers: [LivreurService],
})
export class LivreurModule { }