require('dotenv').config({ path: '/Users/fizualstd/Documents/GitHub/auto-service/be/.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  try {
    const count = await prisma.service_bundles.count();
    const bundles = await prisma.service_bundles.findMany({ 
      take: 5,
      include: { items: true }
    });
    console.log('--- DB CHECK ---');
    console.log('Count:', count);
    console.log('Data (sample):', JSON.stringify(bundles, null, 2));
  } catch (err) {
    console.error('--- DB ERROR ---');
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
