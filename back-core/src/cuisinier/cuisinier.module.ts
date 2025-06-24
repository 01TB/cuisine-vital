import { Module } from '@nestjs/common';
import { CuisinierController } from './cuisinier.controller';
import { CuisinierService } from './cuisinier.service';

@Module({
  controllers: [CuisinierController],
  providers: [CuisinierService]
})
export class CuisinierModule {}
