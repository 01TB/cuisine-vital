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
import { ConfigModule } from '@nestjs/config';
import { StatutsCommande } from '../entities/StatutsCommande';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
    ]),
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule {}
