// src/admin/admin.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Abonnements } from '../entities/Abonnements';
import { Clients } from '../entities/Clients';
import { TypesAbonnement } from '../entities/TypesAbonnement';
import { Repository } from 'typeorm';
import { CreateAbonnementDto } from './dto/create-abonnement.dto';
import { UpdateAbonnementDto } from './dto/update-abonnement.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Abonnements)
    private abonnementsRepository: Repository<Abonnements>,
    @InjectRepository(Clients)
    private clientsRepository: Repository<Clients>,
    @InjectRepository(TypesAbonnement)
    private typesAbonnementRepository: Repository<TypesAbonnement>,
  ) {}

  /**
   * Crée un nouvel abonnement.
   * Vérifie que le client existe, est de type "entreprise" et que le type d'abonnement existe.
   */
  async create(createAbonnementDto: CreateAbonnementDto): Promise<Abonnements> {
    const { clientId, typeAbonnementId, ...rest } = createAbonnementDto;

    const client = await this.clientsRepository.findOneBy({ id: clientId });
    if (!client) {
      throw new NotFoundException(`Client avec l'ID ${clientId} non trouvé.`);
    }
    if (client.typeClient !== 'entreprise') {
      throw new BadRequestException(`Client avec l'ID ${clientId} n'est pas de type "entreprise".`);
    }

    const typeAbonnement = await this.typesAbonnementRepository.findOneBy({ id: typeAbonnementId });
    if (!typeAbonnement) {
      throw new NotFoundException(`Type Abonnement avec ID ${typeAbonnementId} non trouvé.`);
    }

    const newAbonnement = this.abonnementsRepository.create({
      ...rest,
      client: Promise.resolve(client),
      typeAbonnement: Promise.resolve(typeAbonnement),
      clientId: client.id, // Assurez-vous que l'ID est également défini
    });

    return this.abonnementsRepository.save(newAbonnement);
  }

  /**
   * Récupère tous les abonnements avec leurs relations (client et type d'abonnement).
   */
  async findAll(): Promise<Abonnements[]> {
    return this.abonnementsRepository.find({
      relations: ['client', 'typeAbonnement'],
      // L'entité utilisant le soft delete, on récupère uniquement les non supprimés par défaut
      withDeleted: false, 
    });
  }

  /**
   * Récupère un abonnement par son ID.
   */
  async findOne(id: string): Promise<Abonnements> {
    const abonnement = await this.abonnementsRepository.findOne({
      where: { id },
      relations: ['client', 'typeAbonnement'],
    });
    if (!abonnement) {
      throw new NotFoundException(`Abonnement with ID ${id} not found.`);
    }
    return abonnement;
  }

  /**
   * Met à jour un abonnement.
   */
  async update(id: string, updateAbonnementDto: UpdateAbonnementDto): Promise<Abonnements> {
    const { clientId, typeAbonnementId, ...rest } = updateAbonnementDto;

    // preload charge l'entité existante et la fusionne avec les nouvelles données
    const abonnementToUpdate = await this.abonnementsRepository.preload({
      id,
      ...rest,
    });

    if (!abonnementToUpdate) {
      throw new NotFoundException(`Abonnement with ID ${id} not found.`);
    }
    
    // Gérer les mises à jour de relations si nécessaire (non inclus ici pour rester simple)
    if (clientId) {
        throw new BadRequestException("Changing the client of a subscription is not allowed via this method.");
    }
    if (typeAbonnementId) {
        throw new BadRequestException("Changing the subscription type is not allowed via this method.");
    }

    return this.abonnementsRepository.save(abonnementToUpdate);
  }

  /**
   * Supprime un abonnement (soft delete).
   */
  async remove(id: string): Promise<void> {
    const result = await this.abonnementsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Abonnement with ID ${id} not found.`);
    }
  }
}