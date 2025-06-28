// src/test-livreur-statut.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LivreurService } from './livreur/livreur.service';
import { CommandeType } from './cuisinier/enums/commande-type.enum';

async function bootstrap() {
  console.log('Initialisation du contexte de l\'application...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const livreurService = app.get(LivreurService);
  console.log('Service Livreur récupéré.');
  console.log('--- DÉBUT DU TEST DE MISE À JOUR DE STATUT PAR LE LIVREUR ---');

  // --- CONFIGURATION DU TEST ---
  // ID d'une commande qui serait "Prête pour livraison" (statutId = 3)
  // Utilisons une commande existante de nos données de test après l'avoir passée au statut 3.
  const commandeIdIndividuelle = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  // Le livreur change le statut à "En cours de livraison" (4)
  const nouveauStatutId = 5;
  // -----------------------------

  try {
    console.log(`\n▶️  Le livreur met à jour la commande [${commandeIdIndividuelle}] vers le statut [${nouveauStatutId}]...`);
    const resultat = await livreurService.updateCommandeStatut(
      commandeIdIndividuelle,
      CommandeType.INDIVIDUELLE,
      nouveauStatutId
    );
    console.log('✅ Succès ! Commande mise à jour. Nouveau statutId:', resultat.statutId);
    
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour du statut :`, error.message);
  }


  console.log('\n--- FIN DU TEST ---');
  await app.close();
  console.log('Contexte de l application fermé.');
}

bootstrap();