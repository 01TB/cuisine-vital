import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminService } from './admin/admin.service';

async function bootstrap() {
  // pour tester les fonctions des services en lignes de commandes
  // NB: ne pas utiliser les controllers ici
  // pour compiler et executer: npx ts-node [le nom du fichier].ts

  const app = await NestFactory.createApplicationContext(AppModule);

  const adminService = app.get(AdminService);
  const res = await adminService.findCaca();

  console.log('▶ Liste des utilisateurs :', res);

  await app.close();
}
bootstrap();
