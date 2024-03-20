import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    cors: { origin: 'http://localhost:5173', credentials: true },
  });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
