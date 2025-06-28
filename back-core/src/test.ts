import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; 
import { CuisinierService } from './cuisinier/cuisinier.service';
import { AdminService } from './admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const adminService = app.get(AdminService);



  //test princi
  const p1 = await adminService.getOrderStatusSummary();
  console.log('▶ Liste des statuts de commandes :', p1);

  await app.close();
}

bootstrap();