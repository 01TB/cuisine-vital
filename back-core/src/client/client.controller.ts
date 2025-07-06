import { 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  UseGuards 
} from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtAuthGuard } from '../guards/jwt-auth';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Clients } from '../entities/Clients';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { CreateCommande } from './dto/create-commande.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @Get('auth')
  async authenticateClient(@CurrentUser() user: any) {
    console.log('[ClientController] Authenticating client. User from token:', user);
    try {
      const client = await this.clientService.getClientById(user.userId);
      console.log('[ClientController] Client found by ID:', client);
      
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
      console.error('[ClientController] Error during authentication:', error);
      throw new HttpException(
        error.message || 'Token invalide',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('register')
  async registerClient(@Body() clientData: Clients): Promise<Clients> {
    console.log('[ClientController] Registering new client. Data:', clientData);
    try {

      const newClient = await this.clientService.saveClient(clientData);
      console.log('[ClientController] Client registered successfully:', newClient.id);
      const { motDePasse, ...result } = newClient;
      return result as Clients; 
    } catch (error) {
      console.error('[ClientController] Error during client registration:', error);
      throw new HttpException(
        error.message || "Erreur lors de l'inscription du client.",
        HttpStatus.BAD_REQUEST 
      );
    }
  }

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: any, @Body() createCommande: CreateCommande) {
    try {
      createCommande.clientId = user.userId; 
      const result = await this.clientService.creerCommandeClient(createCommande);
      return { message: 'Commande créée avec succès', commande: result.commande, details: result.details };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la création de la commande.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('menus')
  async getAllMenus() {
    try {
      const menus = await this.clientService.getAllMenus();
      return menus;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des menus.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('accompagnements')
  async getAllAccompagnements() {
    try {
      const accompagnements = await this.clientService.getAllAccompagnements();
      console.log(accompagnements);
      return accompagnements;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des accompagnements.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('boissons')
  async getAllBoissons() {
    try {
      const boissons = await this.clientService.getAllBoissons();
      return boissons;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des boissons.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}