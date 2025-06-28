// src/admin/admin.module.ts

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abonnements } from '../entities/Abonnements';
import { Clients } from '../entities/Clients';
import { TypesAbonnement } from '../entities/TypesAbonnement';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Abonnements, 
      Clients, 
      TypesAbonnement
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}