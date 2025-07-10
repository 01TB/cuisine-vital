
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateurs } from '../entities/Utilisateurs';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { LocalUserStrategy } from '../strategies/local-user.strategy';
import { JwtUserStrategy } from '../strategies/jwt-user.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateurs]),
    PassportModule.register({ defaultStrategy: 'jwt-user' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Vous pouvez utiliser un secret différent si nécessaire
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserAuthService, LocalUserStrategy, JwtUserStrategy],
  controllers: [UserAuthController],
  exports: [UserAuthService, JwtModule, PassportModule],
})
export class UserAuthModule {}
