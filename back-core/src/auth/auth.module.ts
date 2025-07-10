import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../strategies/jw.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from '../strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clients } from '../entities/Clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([Clients]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}