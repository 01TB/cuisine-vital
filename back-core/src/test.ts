import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminService } from './admin/admin.service';

async function bootstrap() {
  // pour tester les fonctions des services en lignes de commandes
  // NB: ne pas utiliser les controllers ici
  // pour compiler et executer: npx ts-node [le nom du fichier].ts

  const app = await NestFactory.createApplicationContext(AppModule);

  const adminService = app.get(AdminService);



  //test princi
  // const p1 = await adminService.getOrderStatusSummary();
  // console.log('▶ Liste des statuts de commandes :', p1);
  const p2 = await adminService.getCommandesHistory();
  console.log('▶ Historique des commandes :', p2);

  await app.close();
}
bootstrap();
