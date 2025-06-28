import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientService } from './client/client.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const clientService = app.get(ClientService);

  // ---------------------------- test manao commande entreprise -------------------
  const fakeCommande = {
    numeroCommande: 'CMD-ENTR-0006',
    clientId: '7c88f343-7290-40b2-a274-6f1c88cb3467', 
    abonnementId: '614b7468-bd6f-4666-8765-6458616f4227',
    statutId: 1, // RECUE
    dateCommande: new Date().toISOString(),
    dateLivraison: new Date(new Date().getTime() + 86400000).toISOString(), 
    adresseLivraison: 'Zone industrielle Andraharo',
    montantTotal: 120.50,
    livreurId: 'e81f4c81-5fd2-4041-a076-60062c7362f8', 
    details: [
      {
        menuId: 1,               
        accompagnementId: 1,     
        quantite: 2,
        prixUnitaire: 20.25,
        boissonId: 1,            
        notes: 'Sans piment'
      },
      {
        menuId: 2,
        accompagnementId: 2,
        quantite: 1,
        prixUnitaire: 25.00,
        boissonId: null,
        notes: ''
      }
    ]
  };

  try {
    const res = await clientService.creerCommandeClient(false, fakeCommande);
    console.log('Commande créée avec succès :');
    console.dir(res, { depth: null });
  } catch (e) {
    console.error('Erreur lors de la création de la commande :', e.message);
  }

  // ----------------------test anaoavana annulation ana commande----------------------------------------------- 
  try {
    const res = await clientService.annulerCommande(false, 'd84442ec-01e3-4d6f-9155-e4a10799e8a2');
    console.log(res);
  }catch (e) {
    console.error(e.message);
  }

  await app.close();
}
bootstrap();
