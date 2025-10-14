import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 創建用戶
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nx-playground.local' },
    update: {},
    create: {
      email: 'admin@nx-playground.local',
      name: '管理員',
      role: 'admin',
      status: 'active',
    },
  });

  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@nx-playground.local' },
    update: {},
    create: {
      email: 'organizer@nx-playground.local',
      name: '活動主辦人',
      role: 'organizer',
      status: 'active',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user@nx-playground.local' },
    update: {},
    create: {
      email: 'user@nx-playground.local',
      name: '一般用戶',
      role: 'user',
      status: 'active',
    },
  });

  console.log('✅ Created users:', { admin, organizer, user1 });

  // 創建表單
  const form = await prisma.form.upsert({
    where: { id: 'form_basic' },
    update: {},
    create: {
      id: 'form_basic',
      name: '基本報名表單',
      schema: JSON.stringify({
        fields: [
          { id: 'name', type: 'text', label: '姓名', required: true },
          { id: 'email', type: 'email', label: 'Email', required: true },
          { id: 'phone', type: 'tel', label: '電話', required: false },
          { id: 'note', type: 'textarea', label: '備註', required: false },
        ],
      }),
    },
  });

  console.log('✅ Created form:', form);

  // 創建活動
  const event1 = await prisma.event.create({
    data: {
      title: 'React 19 技術分享會',
      description: '深入了解 React 19 的新特性和最佳實踐',
      location: '台北市信義區',
      startDate: new Date('2025-11-15T14:00:00Z'),
      endDate: new Date('2025-11-15T17:00:00Z'),
      maxAttendees: 50,
      status: 'published',
      formId: form.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'NestJS 實戰工作坊',
      description: '從零開始構建企業級後端應用',
      location: '台北市大安區',
      startDate: new Date('2025-12-01T09:00:00Z'),
      endDate: new Date('2025-12-01T16:00:00Z'),
      maxAttendees: 30,
      status: 'published',
      formId: form.id,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Nx Monorepo 最佳實踐',
      description: '大型專案的架構設計和管理',
      location: '線上',
      startDate: new Date('2025-12-20T19:00:00Z'),
      endDate: new Date('2025-12-20T21:00:00Z'),
      maxAttendees: 100,
      status: 'draft',
      formId: form.id,
    },
  });

  console.log('✅ Created events:', { event1, event2, event3 });

  // 創建訂單
  const order1 = await prisma.order.create({
    data: {
      eventId: event1.id,
      userId: user1.id,
      status: 'confirmed',
      data: JSON.stringify({
        name: '一般用戶',
        email: 'user@nx-playground.local',
        phone: '0912345678',
        note: '期待參加！',
      }),
    },
  });

  const order2 = await prisma.order.create({
    data: {
      eventId: event2.id,
      userId: user1.id,
      status: 'pending',
      data: JSON.stringify({
        name: '一般用戶',
        email: 'user@nx-playground.local',
        phone: '0912345678',
      }),
    },
  });

  console.log('✅ Created orders:', { order1, order2 });

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
