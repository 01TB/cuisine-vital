import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommandeStatutView } from '../entities/commande-statut-view.entity';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandeType } from './enums/commande-type.enum';
import { CommandeHistoriqueView } from '../entities/commande-historique.view.entity';
import { Menus } from '../entities/Menus';


@Injectable()
export class CuisinierService {
    constructor(
        @InjectRepository(CommandeStatutView)
        private readonly commandeStatutViewRepository: Repository<CommandeStatutView>,

        @InjectRepository(CommandesIndividuelles)
        private readonly commandesIndividuellesRepository: Repository<CommandesIndividuelles>,

        @InjectRepository(CommandesEntreprises)
        private readonly commandesEntreprisesRepository: Repository<CommandesEntreprises>,

        @InjectRepository(CommandeHistoriqueView)
        private readonly historiqueRepository: Repository<CommandeHistoriqueView>,


        @InjectRepository(Menus)
        private readonly menuRepository: Repository<Menus>,
    ) { }


    async findCommandeStatus(): Promise<CommandeStatutView[]> {
        return this.commandeStatutViewRepository.find({
            order: {
                ordre: 'ASC',
            },
        });
    }


    async validationCommande(id: string, type: CommandeType, statutId: number): Promise<CommandesIndividuelles | CommandesEntreprises> {
        switch (type) {
            case CommandeType.INDIVIDUELLE:
                return this.updateStatusCommande(this.commandesIndividuellesRepository, id, statutId);
            case CommandeType.ENTREPRISE:
                return this.updateStatusCommande(this.commandesEntreprisesRepository, id, statutId);
            default:
                throw new BadRequestException('Type de commande non valide');
        }
    }


    private async updateStatusCommande<T extends { id: string, statutId: number }>(
        repository: Repository<T>,
        id: string,
        statutId: number,
    ): Promise<T> {
        const result = await repository.update(id, { statutId: statutId } as any);

        if (result.affected === 0) {
            throw new NotFoundException(`La commande de type '${repository.metadata.tableName}' avec l'ID "${id}" n'a pas été trouvée.`);
        }

        return repository.findOneBy({ id } as any);
    }


    async findHistoriqueComplet(): Promise<CommandeHistoriqueView[]> {
        return this.historiqueRepository.find({
            order: {
                date_commande: 'DESC',
            },
        });
    }



    

}
