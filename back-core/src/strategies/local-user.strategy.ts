
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuthService } from '../user-auth/user-auth.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, 'local-user') {
  constructor(private userAuthService: UserAuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string): Promise<any> {
    const user = await this.userAuthService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects pour l'utilisateur');
    }
    return user;
  }
}
