import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Active le CORS ici
  app.enableCors({
    origin: 'http://localhost:5173', // autorise uniquement ton frontend
  });

  await app.listen(3000);
}
bootstrap();
