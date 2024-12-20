import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    // CORS の設定
    origin: process.env.CORS_ORIGIN, // 許可するIPアドレス
    credentials: true, // クライアント側でCookieを使うための設定
  });
  app.use(cookieParser()); // Cookie のパース
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
