import { Controller, Get } from '@nestjs/common';
import { CuisinierService } from './cuisinier.service';
import { CommandesIndividuelles } from 'src/entities/CommandesIndividuelles';

@Controller('cuisinier')
export class CuisinierController {
    constructor(
        private readonly commandeService: CuisinierService
    ) { }

    @Get()
    findCommandeIndividuelle(): Promise<CommandesIndividuelles[]> {
        return this.commandeService.findCommandeIndividuelle();
    }


    
}
