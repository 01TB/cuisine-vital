import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LivreurService } from './livreur/livreur.service';

async function bootstrap() {
  console.log('Initialisation du contexte de l\'application...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Contexte initialisé.');

  // Récupérer le service via l'injection de dépendances
  const livreurService = app.get(LivreurService);
  console.log('Service Livreur récupéré.');

  console.log('\n--- DÉBUT DU TEST DE RÉCUPÉRATION DE TOUTES LES LIVRAISONS ---');

  try {
    console.log(`\n▶️  Tentative de récupération de toutes les livraisons...`);

    // Appel de la méthode sans argument
    const toutesLesLivraisons = await livreurService.getAllLivraisons();
    
    // Vérifier si des livraisons ont été retournées
    if (toutesLesLivraisons.length === 0) {
      console.log('✅ Succès ! Aucune livraison n\'a été trouvée dans la base de données.');
    } else {
      console.log(`✅ Succès ! ${toutesLesLivraisons.length} livraison(s) au total trouvée(s).`);
      
      // Affichage détaillé de chaque livraison trouvée
      toutesLesLivraisons.forEach(async (livraison, index) => {
        console.log(`\n--- Livraison #${index + 1} ---`);
        console.log(`  ID       : ${livraison.id}`);
        console.log(`  Type     : ${livraison.type}`);
        console.log(`  Adresse  : ${livraison.adresse}`);
        console.log(`  Statut   : ${livraison.statut}`);
        
        // Affiche les informations du livreur s'il est présent, sinon indique "Non assigné"
        if (livraison.livreur) {
          // Note : Vous devrez peut-être ajuster les champs (nom, prenom) selon votre entité Utilisateurs
          console.log(`  Livreur  : ${livraison.livreur['prenom'] || ''} ${livraison.livreur['nom'] || ''} (ID: ${(await livraison.livreur).id})`);
        } else {
          console.log(`  Livreur  : Non assigné`);
        }
      });
    }

  } catch (error) {
    // Gérera les erreurs, par exemple un problème de connexion à la base de données
    console.error(`❌ Erreur lors de la récupération des livraisons :`, error.message);
  }

  console.log('\n--- FIN DU TEST ---');
  await app.close();
  console.log('Contexte de l\'application fermé.');
}

// Lancement du script
bootstrap();