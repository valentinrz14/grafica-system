'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== 'default') __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const bcrypt = __importStar(require('bcryptjs'));
require('dotenv/config');
const prisma = new client_1.PrismaClient();
async function main() {
  console.log('🌱 Seeding database...');
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@grafica.com' },
    update: {
      passwordHash: adminPasswordHash,
      role: client_1.UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'System',
      phoneNumber: '1112345678',
      profileComplete: true,
      oauthProvider: 'local',
    },
    create: {
      email: 'admin@grafica.com',
      passwordHash: adminPasswordHash,
      role: client_1.UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'System',
      phoneNumber: '1112345678',
      profileComplete: true,
      oauthProvider: 'local',
    },
  });
  console.log('✅ Admin user created/updated:', adminUser.email);
  console.log('   Password: Admin123!');
  const testPasswordHash = await bcrypt.hash('Test123!', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      passwordHash: testPasswordHash,
      role: client_1.UserRole.USER,
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+54 9 11 8765-4321',
      profileComplete: true,
      oauthProvider: 'local',
    },
    create: {
      email: 'test@example.com',
      passwordHash: testPasswordHash,
      role: client_1.UserRole.USER,
      firstName: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+54 9 11 8765-4321',
      profileComplete: true,
      oauthProvider: 'local',
    },
  });
  console.log('✅ Test user created/updated:', testUser.email);
  console.log('   Password: Test123!');
  const pricingConfig = await prisma.pricingConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      basePrice: 10,
      colorMultiplier: 1.5,
      duplexMultiplier: 0.9,
    },
  });
  console.log('✅ Pricing config created:', pricingConfig);
  console.log('\n🏷️  Creating categories...');
  const categoryFotocopias = await prisma.category.create({
    data: {
      name: 'Fotocopias e Impresiones',
      slug: 'fotocopias',
      description: 'Impresión y fotocopiado de documentos, apuntes y más',
      icon: '📄',
      sortOrder: 1,
    },
  });
  console.log('  ✅ Categoría creada:', categoryFotocopias.name);
  const categoryStickers = await prisma.category.create({
    data: {
      name: 'Stickers y Etiquetas',
      slug: 'stickers',
      description: 'Stickers personalizados para todos los usos',
      icon: '🏷️',
      sortOrder: 2,
    },
  });
  console.log('  ✅ Categoría creada:', categoryStickers.name);
  const categoryFolletos = await prisma.category.create({
    data: {
      name: 'Folletos y Volantes',
      slug: 'folletos',
      description: 'Flyers promocionales y material de marketing',
      icon: '📰',
      sortOrder: 3,
    },
  });
  console.log('  ✅ Categoría creada:', categoryFolletos.name);
  const categoryFotos = await prisma.category.create({
    data: {
      name: 'Impresión de Fotos',
      slug: 'fotos',
      description: 'Revelado de fotos en diferentes formatos',
      icon: '📸',
      sortOrder: 4,
    },
  });
  console.log('  ✅ Categoría creada:', categoryFotos.name);
  const categoryTarjetas = await prisma.category.create({
    data: {
      name: 'Tarjetas Personales',
      slug: 'tarjetas',
      description: 'Tarjetas de presentación y corporativas',
      icon: '💼',
      sortOrder: 5,
    },
  });
  console.log('  ✅ Categoría creada:', categoryTarjetas.name);
  console.log('\n📦 Creating products and options...');
  const productFotocopias = await prisma.product.create({
    data: {
      categoryId: categoryFotocopias.id,
      name: 'Fotocopias Estándar',
      slug: 'fotocopias-estandar',
      description: 'Fotocopias e impresiones de documentos',
      basePrice: 50,
      sortOrder: 1,
      options: {
        create: [
          {
            name: 'size',
            label: 'Tamaño',
            type: 'SELECT',
            required: true,
            sortOrder: 1,
            values: {
              create: [
                { label: 'A4', value: 'a4', priceModifier: 0, sortOrder: 1 },
                {
                  label: 'Oficio',
                  value: 'oficio',
                  priceModifier: 10,
                  sortOrder: 2,
                },
                { label: 'A3', value: 'a3', priceModifier: 30, sortOrder: 3 },
              ],
            },
          },
          {
            name: 'color',
            label: 'Color',
            type: 'RADIO',
            required: true,
            sortOrder: 2,
            values: {
              create: [
                {
                  label: 'Blanco y Negro',
                  value: 'bw',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Color',
                  value: 'color',
                  priceModifier: 100,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'duplex',
            label: 'Impresión',
            type: 'RADIO',
            required: true,
            sortOrder: 3,
            values: {
              create: [
                {
                  label: 'Simple Faz',
                  value: 'simplex',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Doble Faz',
                  value: 'duplex',
                  priceModifier: 20,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'quantity',
            label: 'Cantidad de copias',
            type: 'NUMBER',
            required: true,
            sortOrder: 4,
            values: {
              create: [
                {
                  label: 'Cantidad',
                  value: '1',
                  priceModifier: 0,
                  sortOrder: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('  ✅ Producto creado:', productFotocopias.name);
  const productStickers = await prisma.product.create({
    data: {
      categoryId: categoryStickers.id,
      name: 'Stickers de Vinilo',
      slug: 'stickers-vinilo',
      description: 'Stickers personalizados en vinilo de alta calidad',
      basePrice: 200,
      sortOrder: 1,
      options: {
        create: [
          {
            name: 'size',
            label: 'Tamaño',
            type: 'SELECT',
            required: true,
            sortOrder: 1,
            values: {
              create: [
                {
                  label: '5x5 cm',
                  value: '5x5',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: '7x7 cm',
                  value: '7x7',
                  priceModifier: 50,
                  sortOrder: 2,
                },
                {
                  label: '10x10 cm',
                  value: '10x10',
                  priceModifier: 100,
                  sortOrder: 3,
                },
                {
                  label: 'A6 (10x15 cm)',
                  value: 'a6',
                  priceModifier: 150,
                  sortOrder: 4,
                },
                {
                  label: 'A5 (15x21 cm)',
                  value: 'a5',
                  priceModifier: 300,
                  sortOrder: 5,
                },
              ],
            },
          },
          {
            name: 'finish',
            label: 'Acabado',
            type: 'RADIO',
            required: true,
            sortOrder: 2,
            values: {
              create: [
                {
                  label: 'Brillante',
                  value: 'glossy',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Mate',
                  value: 'matte',
                  priceModifier: 50,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'cut',
            label: 'Tipo de Corte',
            type: 'RADIO',
            required: true,
            sortOrder: 3,
            values: {
              create: [
                {
                  label: 'Rectangular',
                  value: 'rectangular',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Circular',
                  value: 'circular',
                  priceModifier: 20,
                  sortOrder: 2,
                },
                {
                  label: 'Troquelado (forma personalizada)',
                  value: 'die-cut',
                  priceModifier: 100,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'quantity',
            label: 'Cantidad',
            type: 'SELECT',
            required: true,
            sortOrder: 4,
            values: {
              create: [
                {
                  label: '10 unidades',
                  value: '10',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: '25 unidades',
                  value: '25',
                  priceModifier: 200,
                  sortOrder: 2,
                },
                {
                  label: '50 unidades',
                  value: '50',
                  priceModifier: 500,
                  sortOrder: 3,
                },
                {
                  label: '100 unidades',
                  value: '100',
                  priceModifier: 800,
                  sortOrder: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('  ✅ Producto creado:', productStickers.name);
  const productFolletos = await prisma.product.create({
    data: {
      categoryId: categoryFolletos.id,
      name: 'Folletos Promocionales',
      slug: 'folletos-promocionales',
      description: 'Volantes y flyers para promocionar tu negocio',
      basePrice: 1500,
      sortOrder: 1,
      options: {
        create: [
          {
            name: 'size',
            label: 'Tamaño',
            type: 'SELECT',
            required: true,
            sortOrder: 1,
            values: {
              create: [
                {
                  label: 'A6 (10x15 cm)',
                  value: 'a6',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'A5 (15x21 cm)',
                  value: 'a5',
                  priceModifier: 500,
                  sortOrder: 2,
                },
                {
                  label: 'A4 (21x30 cm)',
                  value: 'a4',
                  priceModifier: 1000,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'paper',
            label: 'Tipo de Papel',
            type: 'SELECT',
            required: true,
            sortOrder: 2,
            values: {
              create: [
                {
                  label: 'Obra 80g',
                  value: 'obra-80',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Ilustración 115g',
                  value: 'ilustracion-115',
                  priceModifier: 300,
                  sortOrder: 2,
                },
                {
                  label: 'Ilustración 150g',
                  value: 'ilustracion-150',
                  priceModifier: 500,
                  sortOrder: 3,
                },
                {
                  label: 'Couché 170g',
                  value: 'couche-170',
                  priceModifier: 800,
                  sortOrder: 4,
                },
              ],
            },
          },
          {
            name: 'sides',
            label: 'Impresión',
            type: 'RADIO',
            required: true,
            sortOrder: 3,
            values: {
              create: [
                {
                  label: 'Simple Faz',
                  value: 'simplex',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Doble Faz',
                  value: 'duplex',
                  priceModifier: 500,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'quantity',
            label: 'Cantidad',
            type: 'SELECT',
            required: true,
            sortOrder: 4,
            values: {
              create: [
                {
                  label: '100 unidades',
                  value: '100',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: '250 unidades',
                  value: '250',
                  priceModifier: 1000,
                  sortOrder: 2,
                },
                {
                  label: '500 unidades',
                  value: '500',
                  priceModifier: 2500,
                  sortOrder: 3,
                },
                {
                  label: '1000 unidades',
                  value: '1000',
                  priceModifier: 4000,
                  sortOrder: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('  ✅ Producto creado:', productFolletos.name);
  const productFotos = await prisma.product.create({
    data: {
      categoryId: categoryFotos.id,
      name: 'Revelado de Fotos',
      slug: 'revelado-fotos',
      description: 'Impresión de fotos en papel fotográfico',
      basePrice: 150,
      sortOrder: 1,
      options: {
        create: [
          {
            name: 'size',
            label: 'Tamaño',
            type: 'SELECT',
            required: true,
            sortOrder: 1,
            values: {
              create: [
                {
                  label: '10x15 cm (4R)',
                  value: '10x15',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: '13x18 cm (5R)',
                  value: '13x18',
                  priceModifier: 50,
                  sortOrder: 2,
                },
                {
                  label: '15x20 cm (6R)',
                  value: '15x20',
                  priceModifier: 100,
                  sortOrder: 3,
                },
                {
                  label: '20x25 cm (8R)',
                  value: '20x25',
                  priceModifier: 200,
                  sortOrder: 4,
                },
                {
                  label: '20x30 cm',
                  value: '20x30',
                  priceModifier: 300,
                  sortOrder: 5,
                },
              ],
            },
          },
          {
            name: 'finish',
            label: 'Acabado',
            type: 'RADIO',
            required: true,
            sortOrder: 2,
            values: {
              create: [
                {
                  label: 'Brillante',
                  value: 'glossy',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Mate',
                  value: 'matte',
                  priceModifier: 20,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'quantity',
            label: 'Cantidad',
            type: 'NUMBER',
            required: true,
            sortOrder: 3,
            values: {
              create: [
                {
                  label: 'Cantidad',
                  value: '1',
                  priceModifier: 0,
                  sortOrder: 1,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('  ✅ Producto creado:', productFotos.name);
  const productTarjetas = await prisma.product.create({
    data: {
      categoryId: categoryTarjetas.id,
      name: 'Tarjetas de Presentación',
      slug: 'tarjetas-presentacion',
      description: 'Tarjetas personales profesionales',
      basePrice: 800,
      sortOrder: 1,
      options: {
        create: [
          {
            name: 'size',
            label: 'Tamaño',
            type: 'SELECT',
            required: true,
            sortOrder: 1,
            values: {
              create: [
                {
                  label: 'Estándar (9x5 cm)',
                  value: 'standard',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Mini (8x4 cm)',
                  value: 'mini',
                  priceModifier: -100,
                  sortOrder: 2,
                },
              ],
            },
          },
          {
            name: 'paper',
            label: 'Material',
            type: 'SELECT',
            required: true,
            sortOrder: 2,
            values: {
              create: [
                {
                  label: 'Couché 300g',
                  value: 'couche-300',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Texturado 300g',
                  value: 'texturado-300',
                  priceModifier: 200,
                  sortOrder: 2,
                },
                {
                  label: 'Perlado 300g',
                  value: 'perlado-300',
                  priceModifier: 400,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'finish',
            label: 'Acabado',
            type: 'SELECT',
            required: true,
            sortOrder: 3,
            values: {
              create: [
                {
                  label: 'Sin acabado',
                  value: 'none',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: 'Laminado UV',
                  value: 'uv',
                  priceModifier: 300,
                  sortOrder: 2,
                },
                {
                  label: 'Barniz selectivo',
                  value: 'spot-varnish',
                  priceModifier: 500,
                  sortOrder: 3,
                },
              ],
            },
          },
          {
            name: 'quantity',
            label: 'Cantidad',
            type: 'SELECT',
            required: true,
            sortOrder: 4,
            values: {
              create: [
                {
                  label: '100 unidades',
                  value: '100',
                  priceModifier: 0,
                  sortOrder: 1,
                },
                {
                  label: '250 unidades',
                  value: '250',
                  priceModifier: 500,
                  sortOrder: 2,
                },
                {
                  label: '500 unidades',
                  value: '500',
                  priceModifier: 800,
                  sortOrder: 3,
                },
                {
                  label: '1000 unidades',
                  value: '1000',
                  priceModifier: 1200,
                  sortOrder: 4,
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('  ✅ Producto creado:', productTarjetas.name);
  console.log('\n🎉 Creating sample promotion...');
  const promotion = await prisma.promotion.create({
    data: {
      name: '20% OFF en Stickers',
      description: 'Descuento especial en todos los stickers',
      type: 'PERCENTAGE',
      discountValue: 20,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxUses: 100,
      active: true,
      priority: 1,
      categoryIds: [categoryStickers.id],
      productIds: [],
    },
  });
  console.log('  ✅ Promoción creada:', promotion.name);
  console.log('\n🎉 V2 Seeding completed!');
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
//# sourceMappingURL=seed.js.map
