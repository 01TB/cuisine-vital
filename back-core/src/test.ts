import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Assurez-vous que le chemin est correct
import { LivreurService } from './livreur/livreur.service'; // Assurez-vous que le chemin est correct

/**
 * Script de test en ligne de commande pour le LivreurService.
 *
 * Pour l'exécuter :
 * 1. Remplacez la valeur de LIVERUR_ID_A_TESTER par un ID de livreur réel de votre base de données.
 * 2. Lancez la commande dans votre terminal : npx ts-node src/test-livreur.ts
 */
async function bootstrap() {
  console.log('Initialisation du contexte de l\'application NestJS...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Contexte initialisé.');

  // --- CONFIGURATION DU TEST ---
  //
  // ▼▼▼ MODIFICATION CRUCIALE ▼▼▼
  // Remplacez cette chaîne par l'ID (UUID) d'un livreur existant dans votre base de données.
  // Pour un bon test, assurez-vous que ce livreur a bien des commandes
  // (individuelles ou entreprises) qui lui sont assignées avec un statut "à livrer".
  const LIVERUR_ID_A_TESTER = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; 
  // ▲▲▲ MODIFICATION CRUCIALE ▲▲▲
  //
  // --- FIN DE LA CONFIGURATION ---
  
  if (LIVERUR_ID_A_TESTER === 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') {
    console.error('ERREUR : Veuillez modifier le fichier test-livreur.ts et renseigner un ID de livreur valide dans la variable LIVERUR_ID_A_TESTER.');
    await app.close();
    return;
  }

  try {
    // 1. Récupérer l'instance du service depuis le contexte de l'application
    const livreurService = app.get(LivreurService);
    console.log(`\nRecherche des commandes à livrer pour le livreur ID : ${LIVERUR_ID_A_TESTER}`);

    // 2. Appeler la méthode que l'on souhaite tester
    const commandes = await livreurService.getCommandesALivrer(LIVERUR_ID_A_TESTER);

    // 3. Afficher le résultat de manière lisible
    if (commandes.length > 0) {
      console.log(`▶ Succès ! ${commandes.length} commande(s) trouvée(s) :`);
      // JSON.stringify avec indentation pour une meilleure lisibilité
      console.log(JSON.stringify(commandes, null, 2));
    } else {
      console.log('▶ Aucune commande à livrer trouvée pour ce livreur.');
      console.log('   Vérifiez que l\'ID est correct et que des commandes avec un statut "à livrer" lui sont bien assignées.');
    }

  } catch (error) {
    console.error('Une erreur est survenue lors du test du service :', error);
  } finally {
    // 4. Fermer la connexion proprement
    await app.close();
    console.log('\nContexte de l\'application fermé.');
  }
}

bootstrap();