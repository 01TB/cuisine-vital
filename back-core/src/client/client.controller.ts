import { 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  UseGuards, 
  Query
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
        prenom: client.prenom,
        typeClient: client.typeClient
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
    try {

      const newClient = await this.clientService.saveClient(clientData);
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

  @Get('commandes')
  @UseGuards(JwtAuthGuard)
  async getCommandes(
    @CurrentUser() user: any,
    @Query('clientIndividuel') clientIndividuel: boolean,
    @Query('statutOrderLessThan') statutOrderLessThan: number,
    @Query('statutOrder') statutOrder: number,
  ) {
    try {
      const clientId = user.userId;
      const commandes = await this.clientService.getCommandes(
        clientIndividuel,
        null,
        null,
        null,
        clientId,
        statutOrder,
        statutOrderLessThan
      );
      return commandes;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des commandes.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cancel-order')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Body('commandeId') commandeId: string,
    @Body('commandeIndividuelle') commandeIndividuelle: boolean,
  ) {
    try {
      const result = await this.clientService.annulerCommande(commandeIndividuelle, commandeId);
      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }
      return { message: result.message };
    } catch (error) {
      throw new HttpException(
        error.message || "Erreur lors de l'annulation de la commande.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('enterprise-profile/:clientId')
  @UseGuards(JwtAuthGuard)
  async getEnterpriseClientProfile(@CurrentUser() user: any) {
    try {
      const clientId = user.userId;
      const client = await this.clientService.getClientById(clientId);
      if (!client || client.typeClient !== 'ENTREPRISE') {
        throw new HttpException('Client non trouvé ou non autorisé.', HttpStatus.NOT_FOUND);
      }

      const abonnements = await this.clientService.getAbonnementsByClientId(clientId);
      let subscriptionData = null;
      let orderVouchers = [];

      if (abonnements.length > 0) {
        // Assuming an enterprise client has one active subscription for simplicity
        subscriptionData = abonnements[0];
        orderVouchers = await this.clientService.getBonsCommandeByAbonnementId(subscriptionData.id);
      }

      const availableMenus = await this.clientService.getAllMenus();
      const availableAccompaniments = await this.clientService.getAllAccompagnements();
      const availableBoissons = await this.clientService.getAllBoissons();

      return {
        clientInfo: client,
        subscriptionData,
        availableMenus,
        availableAccompaniments,
        availableBoissons,
        orderVouchers,
      };
    } catch (error) {
      console.error('[ClientController] Error fetching enterprise client profile:', error);
      throw new HttpException(
        error.message || 'Erreur lors de la récupération du profil client entreprise.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}