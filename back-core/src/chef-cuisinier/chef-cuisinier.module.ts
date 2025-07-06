import { Module } from '@nestjs/common';
import { ChefCuisinierController } from './chef-cuisinier.controller';
import { ChefCuisinierService } from './chef-cuisinier.service';

@Module({
  controllers: [ChefCuisinierController],
  providers: [ChefCuisinierService]
})
export class ChefCuisinierModule {}
