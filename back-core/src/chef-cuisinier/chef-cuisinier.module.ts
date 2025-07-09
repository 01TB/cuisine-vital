import { Module } from '@nestjs/common';
import { ChefCuisinierController } from './chef-cuisinier.controller';
import { ChefCuisinierService } from './chef-cuisinier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';
import { CommandesEntreprises } from 'src/entities/CommandesEntreprises';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommandesIndividuelles, CommandesEntreprises]),
  ],
  controllers: [ChefCuisinierController],
  providers: [ChefCuisinierService],
})
export class ChefCuisinierModule {}
