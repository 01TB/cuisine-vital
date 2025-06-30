import { Module } from '@nestjs/common';
import { LivreurController } from './livreur.controller';
import { LivreurService } from './livreur.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles'; // Adaptez le chemin si nécessaire
import { CommandesEntreprises } from '../entities/CommandesEntreprises';   // Adaptez le chemin si nécessaire

@Module({
  imports: [
    // On déclare les entités que ce module pourra manipuler
    TypeOrmModule.forFeature([
      CommandesIndividuelles, 
      CommandesEntreprises
    ])
  ],
  controllers: [LivreurController],
  providers: [LivreurService]
})
export class LivreurModule {}