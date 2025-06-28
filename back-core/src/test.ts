import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import { CuisinierService } from './cuisinier/cuisinier.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const commandeService = app.get(CuisinierService);

  try {
    // 1. Récupération de toutes les commandes
    console.log('⏳ Récupération de toutes les commandes...');
    const allCommandes = await commandeService.findCommandeIndividuelle();
    console.log('✅ Commandes trouvées:', allCommandes.length);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();