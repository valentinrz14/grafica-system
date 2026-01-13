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

3. Instalar git hooks:

```bash
npx lefthook install
```

4. Ejecutar migraciones de Prisma:

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

## Desarrollo

### Git Hooks (Lefthook)

El proyecto usa [Lefthook](https://github.com/evilmartians/lefthook) para ejecutar validaciones automáticas:

**Pre-commit:**

- Ejecuta ESLint en archivos modificados
- Formatea código con Prettier automáticamente
- Corrige y agrega archivos al staging area

**Commit-msg:**

- Valida mensajes de commit con [Commitlint](https://commitlint.js.org/)
- Sigue el estándar [Conventional Commits](https://www.conventionalcommits.org/)

**Pre-push:**

- Compila backend y frontend
- Asegura que no haya errores de TypeScript

### Formato de Commits

Usamos Conventional Commits para mantener un historial limpio:

```bash
<tipo>(<scope>): <descripción>

# Ejemplos:
feat(orders): add date range filter
fix(upload): resolve file size validation
docs: update README with deployment steps
```

Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

### VS Code

El proyecto incluye configuración completa de VS Code:

- Formateo automático al guardar
- ESLint integrado
- Debugging configurado (F5)
- Tareas predefinidas (Cmd+Shift+P → Tasks: Run Task)
- Extensiones recomendadas

### Prisma Studio

Para explorar la base de datos visualmente:

```bash
cd apps/backend
npx prisma studio
```

Se abrirá en http://localhost:5555

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las guías de contribución, estándares de código y flujo de trabajo.

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
