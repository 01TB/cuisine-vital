import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '../entities/Roles';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Roles)
        private roleRepository:Repository<Roles>
    ){}

    async findCaca(){
        return this.roleRepository.find();
    }
}
