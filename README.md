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

## 🚀 Deploy a Producción

**📘 Ver la guía completa de deploy**: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Stack Recomendado

- **Frontend**: Vercel (gratis - 100GB bandwidth/mes)
- **Backend**: Railway (~$5/mes con $5 gratis mensuales)
- **Database**: Neon PostgreSQL (gratis - 0.5GB storage)
- **Email**: Gmail (gratis - 500 emails/día)

**Costo total estimado**: ~$0-5/mes

La guía de deployment incluye:

- ✅ Paso a paso detallado para cada servicio
- ✅ Configuración de variables de entorno
- ✅ Configuración de Gmail App Password
- ✅ Migraciones de base de datos
- ✅ Troubleshooting común
- ✅ Checklist de verificación final

## Características Implementadas

### Autenticación y Usuarios

- ✅ Registro e inicio de sesión con JWT
- ✅ Roles de usuario (USER, ADMIN)
- ✅ Guard de autenticación en rutas protegidas
- ✅ Perfil de usuario con datos adicionales

### Sistema de Pedidos

- ✅ Cotización instantánea
- ✅ Subida de archivos PDF
- ✅ Configuración de opciones (A4/A3/Carta, color, duplex)
- ✅ Historial de pedidos por usuario
- ✅ Estados de pedido (Pendiente, En impresión, Listo, Expirado)
- ✅ Notificaciones por email al crear pedidos

### Sistema de Promociones

- ✅ Gestión completa de promociones (CRUD)
- ✅ Tipos de descuento (porcentaje, monto fijo)
- ✅ Programación de fechas
- ✅ Límite de usos
- ✅ Estados (Activo, Programado, Expirado, Pausado)
- ✅ Priorización de promociones
- ✅ Estadísticas de uso
- ✅ Visualización para usuarios

### Panel de Administración

- ✅ Dashboard con accesos rápidos
- ✅ Gestión de pedidos con filtros
- ✅ Cambio de estados
- ✅ Gestión de promociones
- ✅ Estadísticas de promociones

## Roadmap Futuro

- [ ] WhatsApp API para notificaciones
- [ ] Pagos online (Mercado Pago/Stripe)
- [ ] Multi-tenant (múltiples gráficas)
- [ ] Dashboard de analytics avanzado
- [ ] Google OAuth
- [ ] Exportación de reportes PDF
