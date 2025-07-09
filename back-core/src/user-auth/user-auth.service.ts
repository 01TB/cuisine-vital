
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Utilisateurs } from '../entities/Utilisateurs';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserAuthService {
    constructor(
        @InjectRepository(Utilisateurs)
        private userRepository: Repository<Utilisateurs>,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (user && user.motDePasse) {
            const isPasswordValid = password == user.motDePasse;

            if (isPasswordValid) {
                const { motDePasse, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.roleId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                roleId: user.roleId
            },
        };
    }
}
