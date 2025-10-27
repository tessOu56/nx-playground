import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { logger } from '@nx-playground/logger';
import { AppModule } from './app.module';

// Initialize logger for API Server
logger.setContext({
  app: 'api-server',
  environment: process.env.NODE_ENV || 'development',
});

async function bootstrap() {
  logger.info('API Server starting');
  
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3002',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('NX Playground API')
    .setDescription('Demo API for NX Playground')
    .setVersion('1.0')
    .addTag('events', 'Events management')
    .addTag('users', 'Users management')
    .addTag('forms', 'Forms management')
    .addTag('orders', 'Orders management')
    .addTag('sessions', 'Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Expose OpenAPI JSON endpoint
  app.getHttpAdapter().get('/api-json', (req, res) => {
    res.json(document);
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.info('API Server listening', {
    port,
    apiUrl: `http://localhost:${port}/api`,
    docsUrl: `http://localhost:${port}/api/docs`,
    openapiUrl: `http://localhost:${port}/api-json`,
  });
  
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  console.log(`📄 OpenAPI JSON: http://localhost:${port}/api-json`);
}

bootstrap().catch(error => {
  logger.fatal('API Server failed to start', error);
  process.exit(1);
});
