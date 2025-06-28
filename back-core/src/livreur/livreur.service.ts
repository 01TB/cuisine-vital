import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { CommandesIndividuelles } from '../entities/CommandesIndividuelles';
import { CommandesEntreprises } from '../entities/CommandesEntreprises';
import { CommandeType } from './enums/commande-type.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LivreurService {
    constructor(
        @InjectRepository(CommandesIndividuelles)
        private readonly commandesIndividuellesRepo: Repository<CommandesIndividuelles>,


        @InjectRepository(CommandesEntreprises)
        private readonly commandesEntreprisesRepo: Repository<CommandesEntreprises>,
    ) {}



    async updateCommandeStatut(commandeId: string, type: CommandeType, statutId: number): Promise<CommandesIndividuelles | CommandesEntreprises> {
        switch (type) {
            case CommandeType.INDIVIDUELLE:
                return this._updateStatusCommande(this.commandesIndividuellesRepo, commandeId, statutId);
            case CommandeType.ENTREPRISE:
                return this._updateStatusCommande(this.commandesEntreprisesRepo, commandeId, statutId);
            default:
                throw new BadRequestException('Type de commande non valide');
        }
    }


    
    private async _updateStatusCommande<T extends { id: string, statutId: number }>(
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
}
