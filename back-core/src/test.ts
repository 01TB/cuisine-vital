import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LivreurService } from './livreur/livreur.service';

async function bootstrap() {
  console.log('Initialisation du contexte de l\'application NestJS...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Contexte initialisé.');

  // ▼▼▼ MODIFICATION CRUCIALE ▼▼▼
  // Remplacez par un vrai ID de livreur de votre base de données.
  const LIVERUR_ID_A_TESTER = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; 
  // ▲▲▲ MODIFICATION CRUCIALE ▲▲▲
  
  if (LIVERUR_ID_A_TESTER === 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') {
    console.error('ERREUR : Veuillez modifier le fichier test-livreur.ts et renseigner un ID de livreur valide.');
    await app.close();
    return;
  }

  try {
    const livreurService = app.get(LivreurService);
    console.log(`\n--- Test pour le livreur ID : ${LIVERUR_ID_A_TESTER} ---\n`);

    // --- Test 1: Commandes À LIVRER ---
    console.log('1. Recherche des commandes À LIVRER...');
    const commandesALivrer = await livreurService.getCommandesALivrer(LIVERUR_ID_A_TESTER);
    if (commandesALivrer.length > 0) {
      console.log(`▶ Succès ! ${commandesALivrer.length} commande(s) À LIVRER trouvée(s) :`);
      console.log(JSON.stringify(commandesALivrer, null, 2));
    } else {
      console.log('▶ Aucune commande À LIVRER trouvée pour ce livreur.');
    }

    console.log('\n---------------------------------------------\n');

    // --- Test 2: Commandes EN COURS ---
    console.log('2. Recherche des commandes EN COURS...');
    const commandesEnCours = await livreurService.getCommandesEnCours(LIVERUR_ID_A_TESTER);
    if (commandesEnCours.length > 0) {
        console.log(`▶ Succès ! ${commandesEnCours.length} commande(s) EN COURS trouvée(s) :`);
        console.log(JSON.stringify(commandesEnCours, null, 2));
    } else {
        console.log('▶ Aucune commande EN COURS trouvée pour ce livreur.');
    }

  } catch (error) {
    console.error('Une erreur est survenue lors du test du service :', error);
  } finally {
    await app.close();
    console.log('\nContexte de l\'application fermé.');
  }
}

bootstrap();