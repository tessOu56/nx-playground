import { PrismaClient } from '@prisma/client';

import eventsSeed from '../../../libs/api-fixtures/src/events.json';
import ordersSeed from '../../../libs/api-fixtures/src/orders.json';
import usersSeed from '../../../libs/api-fixtures/src/users.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Resetting demo tables and seeding libs/api-fixtures...');

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

  console.log('🎉 Seed completed from shared fixtures');
}

main()
  .catch(error => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
