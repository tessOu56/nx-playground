const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { writeFileSync } = require('fs');

async function generate() {
  try {
    // 動態導入 AppModule
    const { AppModule } = await import('../src/app.module');

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

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

    // 寫入根目錄的 openapi.json
    writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

    // 也寫入到 libs/api-client/specs/
    writeFileSync(
      './libs/api-client/specs/server.json',
      JSON.stringify(document, null, 2)
    );

    console.log('✅ OpenAPI spec generated!');
    console.log('  - openapi.json');
    console.log('  - libs/api-client/specs/server.json');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI spec:', error);
    process.exit(1);
  }
}

generate();

