import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Clients } from '../entities/Clients';
import * as bcrypt from 'bcryptjs'; 

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Clients)
        private clientRepository: Repository<Clients>,
        private jwtService: JwtService,
    ) {}

    async validateClient(email: string, password: string): Promise<any> {
        const client = await this.clientRepository.findOne({ where: { email } });

        if (client && client.motDePasse) { 
            const isPasswordValid = await bcrypt.compare(password, client.motDePasse);
            
            if (isPasswordValid) {
                const { motDePasse, ...result } = client;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom, 
                typeClient: user.typeClient
            },
        };
    }

    async generateNewToken(email: string) {
        const client = await this.clientRepository
            .createQueryBuilder('clients')
            .where('clients.email = :email AND clients.deleted_at IS NULL', { email })
            .getOne();

        if (!client) {
            throw new Error('Client non trouvé');
        }

        const payload = {
            email: client.email,
            sub: client.id
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: client.id,
                email: client.email,
                nom: client.nom,
                prenom: client.prenom,
                typeClient: client.typeClient
            },
        };
    }
}