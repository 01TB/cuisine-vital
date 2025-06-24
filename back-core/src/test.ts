import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminService } from './admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminService = app.get(AdminService);

  // Appelle les fonctions ici
  console.log('▶ Liste des utilisateurs :', adminService.findCaca());

  await app.close();
}
bootstrap();
