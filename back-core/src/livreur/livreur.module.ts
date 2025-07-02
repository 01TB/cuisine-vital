import { Module } from '@nestjs/common';
import { LivreurController } from './livreur.controller';
import { LivreurService } from './livreur.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { Clients } from '../entities/Clients';
import { ZonesLivraison } from '../entities/ZonesLivraison';
import { LivraisonsIndividuelles } from '../entities/LivraisonsIndividuelles';
import { LivraisonsEntreprises } from '../entities/LivraisonsEntreprises';


import { HttpModule } from '@nestjs/axios';
import { Utilisateurs } from '../entities/Utilisateurs';
import { OsrmModule } from '../osrm/osrm.module';


@Module({
  imports: [
    HttpModule,
    OsrmModule,
    TypeOrmModule.forFeature([
      CommandesIndividuelles,
      CommandesEntreprises,
      Clients,
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