import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user (mock)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@grafica.com' },
    update: {},
    create: {
      email: 'admin@grafica.com',
      passwordHash: null, // No password for mock auth
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', adminUser.email);

  // Create default pricing config
  const pricingConfig = await prisma.pricingConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      basePrice: 10, // $10 per page base price
      colorMultiplier: 1.5, // Color costs 50% more
      duplexMultiplier: 0.9, // Duplex saves 10%
    },
  });
  console.log('✅ Pricing config created:', pricingConfig);

  console.log('🎉 Seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
