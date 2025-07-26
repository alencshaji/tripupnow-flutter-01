import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  logger.log('Starting NestJS application...');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_ADMIN_URL],
    methods: 'GET,POST,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  // ✅ Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('TripUpNow API')
    .setDescription('API documentation for TripUpNow backend')
    .setVersion('1.0')
    .addTag('Trip_Up_Api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'defaultBearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // http://localhost:3000/api-docs

  try {
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`NestJS application started on port ${port}`);
    logger.log(`Swagger docs available at /api-docs`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
