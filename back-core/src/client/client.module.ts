import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accompagnements } from '../entities/Accompagnements';
import { Boissons } from '../entities/Boissons';
import { Clients } from '../entities/Clients';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandesEntreprisesDetails } from '../entities/CommandesEntreprisesDetails';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesIndividuellesDetails } from '../entities/CommandesIndividuellesDetails';
import { Menus } from '../entities/Menus';
import { StatutsCommande } from '../entities/StatutsCommande';
import { Abonnements } from '../entities/Abonnements';
import { TypesAbonnement } from '../entities/TypesAbonnement';
import { BonsCommande } from '../entities/BonsCommande';
import { SelectionsHebdomadaires } from '../entities/SelectionsHebdomadaires';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Clients,
      CommandesIndividuelles,
      CommandesEntreprises,
      CommandesIndividuellesDetails,
      CommandesEntreprisesDetails,
      Menus,
      Accompagnements,
      Boissons,
      StatutsCommande,
      Abonnements,
      TypesAbonnement,
      BonsCommande,
      SelectionsHebdomadaires
    ]),
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
