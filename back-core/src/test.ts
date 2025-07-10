import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LivreurService } from './livreur/livreur.service';

async function bootstrap() {
  console.log('Initialisation du contexte de l\'application...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Contexte initialisé.');

  const livreurService = app.get(LivreurService);

  const livreurIdPourTest = '1605a4b2-4779-4254-95a0-61301425ecdb';

  // --- TEST 4: Récupérer les livraisons pour UN SEUL livreur ---
  console.log('\n--- DÉBUT TEST 4: getLivraisonsPourLivreur ---');
  try {
    console.log(`Récupération des livraisons pour le livreur ID: ${livreurIdPourTest}...`);
    const livraisons = await livreurService.getLivraisonsPourLivreur(livreurIdPourTest);

    if (livraisons.length > 0) {
      console.log(`✅ Succès ! ${livraisons.length} livraison(s) trouvée(s) pour le livreur ${livreurIdPourTest}:`);
      console.dir(livraisons, { depth: null }); // Affiche l'objet complet
    } else {
      console.log(`✅ Succès ! Aucune livraison trouvée pour le livreur ${livreurIdPourTest}.`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des livraisons du livreur :', error.message);
  }
  console.log('--- FIN TEST 4 ---');


  console.log('\nTests terminés. Fermeture de l\'application...');
  await app.close();
  process.exit(0);
}

bootstrap();