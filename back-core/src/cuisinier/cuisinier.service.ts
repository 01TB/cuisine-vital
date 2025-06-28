import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clients } from '../entities/Clients';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { StatutsCommande } from '../entities/StatutsCommande';
import { Repository } from 'typeorm';

@Injectable()
export class CuisinierService {
    constructor(
        @InjectRepository(CommandesIndividuelles)
        private commandeRepository: Repository<CommandesIndividuelles>,

        @InjectRepository(Clients)
        private clientRepository: Repository<Clients>,

        @InjectRepository(StatutsCommande)
        private statutRepository: Repository<StatutsCommande>,
    ) { }


    async findCommandeIndividuelle(): Promise<CommandesIndividuelles[]> {
        return this.commandeRepository.find({
            where: { deletedAt: null },
            relations: ['client', 'livreur', 'statut']
        });
    }



}
