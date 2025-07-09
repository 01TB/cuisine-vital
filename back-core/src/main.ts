import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
<<<<<<< HEAD
    origin: 'http://localhost:5173', 
    credentials: true,
  });
=======
    origin: 'http://localhost:5173',
    credentials: true
  })
>>>>>>> back-princi
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
