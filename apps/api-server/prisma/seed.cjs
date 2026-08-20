'use strict';

const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client');

function loadRootEnv(cwd = process.cwd()) {
  for (const name of ['.env', '.env.local']) {
    const filePath = resolve(cwd, name);
    if (!existsSync(filePath)) continue;
    for (const raw of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq <= 0) continue;
      const key = line.slice(0, eq).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
      if (process.env[key] !== undefined) continue;
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

function assertPostgresUrl(url) {
  if (!url || !String(url).trim()) {
    throw new Error(
      'DATABASE_URL is required. Use the existing Neon event-stack URL or local docker postgres (make db-up). SQLite is not the product path.',
    );
  }
  const trimmed = String(url).trim();
  if (
    trimmed.startsWith('file:') ||
    trimmed.includes('mode=memory') ||
    !/^postgres(ql)?:\/\//i.test(trimmed)
  ) {
    throw new Error(
      'DATABASE_URL must be postgresql (Neon or local docker). SQLite file: URLs are not allowed.',
    );
  }
  return trimmed;
}

function readJson(relPath) {
  return JSON.parse(readFileSync(resolve(__dirname, relPath), 'utf8'));
}

async function main() {
  loadRootEnv();
  assertPostgresUrl(process.env.DATABASE_URL);
  const usersSeed = readJson('../../../libs/api-fixtures/src/users.json');
  const eventsSeed = readJson('../../../libs/api-fixtures/src/events.json');
  const ordersSeed = readJson('../../../libs/api-fixtures/src/orders.json');
  const prisma = new PrismaClient();
  try {
    console.log('Resetting demo tables and seeding libs/api-fixtures...');

    await prisma.order.deleteMany();
    await prisma.event.deleteMany();
    await prisma.form.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    for (const user of usersSeed.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      });
    }

    await prisma.form.create({
      data: {
        id: eventsSeed.form.id,
        name: eventsSeed.form.name,
        schema: JSON.stringify(eventsSeed.form.schema),
      },
    });

    for (const event of eventsSeed.events) {
      await prisma.event.create({
        data: {
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          maxAttendees: event.maxAttendees,
          status: event.status,
          formId: event.formId,
        },
      });
    }

    for (const order of ordersSeed.orders) {
      await prisma.order.create({
        data: {
          id: order.id,
          eventId: order.eventId,
          userId: order.userId,
          status: order.status,
          data: JSON.stringify(order.data),
        },
      });
    }

    console.log('Seed completed from shared fixtures');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error('Seed failed:', error);
  process.exit(1);
});
