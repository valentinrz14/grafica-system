/// <reference types="node" />
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Contraseña hasheada para admin (password: Admin123!)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@grafica.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'System',
      phoneNumber: '1112345678',
      profileComplete: true,
      oauthProvider: 'local',
    },
    create: {
      email: 'admin@grafica.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'System',
      phoneNumber: '1112345678',
      profileComplete: true,
      oauthProvider: 'local',
    },
  });
  console.log('✅ Admin user created/updated:', adminUser.email);
  console.log('   Password: Admin123!');

  // Contraseña hasheada para test user (password: Test123!)
  const testPasswordHash = await bcrypt.hash('Test123!', 12);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      passwordHash: testPasswordHash,
      role: UserRole.USER,
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+54 9 11 8765-4321',
      profileComplete: true,
      oauthProvider: 'local',
    },
    create: {
      email: 'test@example.com',
      passwordHash: testPasswordHash,
      role: UserRole.USER,
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+54 9 11 8765-4321',
      profileComplete: true,
      oauthProvider: 'local',
    },
  });
  console.log('✅ Test user created/updated:', testUser.email);
  console.log('   Password: Test123!');

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
