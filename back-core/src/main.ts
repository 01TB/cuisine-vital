import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⬇️ Activation globale de la validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non définies dans le DTO
      forbidNonWhitelisted: true, // Lève une erreur si une propriété non autorisée est présente
      transform: true, // Transforme automatiquement les payloads en types DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
