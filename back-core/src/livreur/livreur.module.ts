import { Module } from '@nestjs/common';
import { LivreurController } from './livreur.controller';
import { LivreurService } from './livreur.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { Clients } from '../entities/Clients';
import { ZonesLivraison } from '../entities/ZonesLivraison';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommandesIndividuelles,
      CommandesEntreprises,
      Clients,
      ZonesLivraison,
    ]),
  ],
  controllers: [LivreurController],
  providers: [LivreurService],
})
export class LivreurModule {}