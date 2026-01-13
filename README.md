# Sistema Web para Gráfica / Imprenta

Sistema MVP para gestión de pedidos de impresión. Permite a los clientes subir archivos, configurar opciones de impresión y obtener cotizaciones automáticas. El dueño de la gráfica puede gestionar pedidos desde un panel administrativo.

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Base de datos**: PostgreSQL (Railway/Supabase)
- **ORM**: Prisma
- **Storage**: Sistema de archivos local (migrar a Cloudflare R2 en producción)

## Estructura del Proyecto

```
grafica-system/
├── apps/
│   ├── frontend/    # Next.js application
│   └── backend/     # NestJS API
└── packages/
    └── shared/      # Tipos compartidos (opcional)
```

## Requisitos Previos

- Node.js >= 18.0.0
- npm o yarn
- PostgreSQL (Railway o Supabase)

## Configuración Inicial

1. Clonar el repositorio y instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

**Backend** (`apps/backend/.env`):
```env
DATABASE_URL="postgresql://..."
PORT=4000
UPLOAD_DIR="./uploads"
FRONTEND_URL="http://localhost:3000"
```

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

3. Ejecutar migraciones de Prisma:

```bash
cd apps/backend
npx prisma migrate dev
npx prisma db seed
```

## Ejecutar en Desarrollo

### Ambos servicios en paralelo:
```bash
npm run dev
```

### Backend solamente:
```bash
npm run dev:backend
```

### Frontend solamente:
```bash
npm run dev:frontend
```

## Funcionalidades

### Cliente
- Subir archivos (PDF/imágenes)
- Preview de archivos
- Configurar opciones de impresión (tamaño, color, doble faz, cantidad)
- Obtener precio estimado automático
- Enviar pedido con email

### Panel Administrativo
- Ver lista de pedidos
- Filtrar por estado (Pendiente, En impresión, Listo)
- Ver detalle de pedidos
- Descargar archivos
- Actualizar estado de pedidos

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Panel Admin: http://localhost:3000/admin

## Deploy

- **Frontend**: Vercel (free tier)
- **Backend**: Railway (free tier)
- **Database**: Railway PostgreSQL o Supabase (free tier)
- **Storage**: Cloudflare R2 (10GB gratis)

## Fase 2 (Futuro)

- WhatsApp API para notificaciones
- Pagos online
- Autenticación JWT
- Multi-tenant (múltiples gráficas)
- Dashboard de analytics
