import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Roles } from '../entities/Roles';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
