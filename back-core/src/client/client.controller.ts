import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  HttpException, 
  HttpStatus, 
  UseGuards 
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../guards/jwt-auth';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginClient } from './dto/login-client.dto';


@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('login')
  async login(@Body() loginDto: LoginClient) {
    try {
      const result = await this.clientService.login(loginDto.email, loginDto.motDePasse);
      return result; 
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la connexion',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth')
  async authenticateClient(@CurrentUser() user: any) {
    try {
      const client = await this.clientService.getClientById(user.userId);
      
      if (!client) {
        throw new HttpException(
          'Client non trouvé',
          HttpStatus.UNAUTHORIZED
        );
      }

      return {
        id: client.id,
        email: client.email,
        nom: client.nom,
        prenom: client.prenom
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Token invalide',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@CurrentUser() user: any) {
    try {
      const result = await this.clientService.generateNewToken(user.email);
      return result;
    } catch (error) {
      throw new HttpException(
        'Erreur lors du rafraîchissement du token',
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}