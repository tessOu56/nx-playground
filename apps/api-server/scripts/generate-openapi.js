const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

function isEventStackPath(path) {
  return (
    path === '/events' ||
    path.startsWith('/events/') ||
    path === '/orders' ||
    path.startsWith('/orders/') ||
    path === '/tickets' ||
    path.startsWith('/tickets/') ||
    path === '/payments' ||
    path.startsWith('/payments/')
  );
}

async function generate() {
  try {
    const { AppModule } = await import('../src/app.module');

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('NX Playground event-stack API')
      .setDescription(
        'Spine contract from Nest Events + Orders. Frontends use live :3001 or api-mock :3011.'
      )
      .setVersion('1.0')
      .addTag('events', 'Events management')
      .addTag('orders', 'Orders management')
      .addTag('tickets', 'Tickets issue / verify / check-in')
      .addTag('payments', 'PaymentIntent + webhook (mock or ECPay sandbox)')
      .addServer('http://localhost:3001/api', 'live Nest + Prisma')
      .addServer('http://localhost:3011/api', 'stateful contract mock')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    const paths = {};
    for (const [path, item] of Object.entries(document.paths || {})) {
      const normalized = path.replace(/^\/api/, '') || path;
      if (isEventStackPath(normalized) || isEventStackPath(path)) {
        paths[normalized.startsWith('/') ? normalized : `/${normalized}`] = item;
      }
    }

    const eventStack = {
      ...document,
      paths,
    };

    const specPath = resolve(
      __dirname,
      '../../../libs/api-client/specs/event-stack.openapi.json'
    );
    writeFileSync(specPath, JSON.stringify(eventStack, null, 2));
    writeFileSync(
      resolve(__dirname, '../../../openapi.json'),
      JSON.stringify(document, null, 2)
    );

    console.log('✅ OpenAPI dump written');
    console.log('  - libs/api-client/specs/event-stack.openapi.json');
    console.log('  - Keep event-stack.openapi.yaml in sync when DTOs change');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI spec:', error);
    process.exit(1);
  }
}

generate();
