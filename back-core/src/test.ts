import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CuisinierService } from './cuisinier/cuisinier.service';
import { Menus } from './entities/Menus';

async function bootstrap() {
  console.log('Initialisation du contexte de l\'application...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Contexte initialisé.');

  // Récupérer le service via l'injection de dépendances
  const cuisinierService = app.get(CuisinierService);
  console.log('Service Cuisinier récupéré.');
  console.log('--- DÉBUT DU TEST DE MODIFICATION DE MENU ---');

  // --- Données de test ---
  // IMPORTANT : Cet ID doit correspondre à un menu existant dans votre base de données.
  const menuIdToUpdate = 1; 

  // Les nouvelles données à appliquer. On ne fournit que les champs à modifier.
  const menuUpdateData: Partial<Menus> = {
    nom: `Menu Test Mis à Jour à ${new Date().toLocaleTimeString()}`,
    prixCarte: "22.50",
    disponible: false
  };

  try {
    console.log(`\n▶️  Le cuisinier tente de modifier le menu [ID: ${menuIdToUpdate}]...`);
    console.log('   Données de mise à jour:', menuUpdateData);

    const resultat = await cuisinierService.updateMenu(
      menuIdToUpdate,
      menuUpdateData
    );
    
    console.log('✅ Succès ! Menu mis à jour.');
    console.log('   Nouveau nom:', resultat.nom);
    console.log('   Nouveau prix:', resultat.prixCarte);
    console.log('   Nouvelle disponibilité:', resultat.disponible);

  } catch (error) {
    // Gérera les erreurs, y compris la NotFoundException si l'ID n'existe pas
    console.error(`❌ Erreur lors de la modification du menu :`, error.message);
  }


  console.log('\n--- FIN DU TEST ---');
  await app.close();
  console.log('Contexte de l\'application fermé.');
}

bootstrap();