# Guía de Contribución

Gracias por considerar contribuir al proyecto Gráfica System! Este documento te guiará a través del proceso de contribución.

## Configuración del Entorno

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/valentinrz14/grafica-system.git
   cd grafica-system
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar la base de datos:**

   ```bash
   # Copiar ejemplo de .env
   cp apps/backend/.env.example apps/backend/.env

   # Editar apps/backend/.env con tu DATABASE_URL

   # Ejecutar migraciones
   cd apps/backend
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Instalar Lefthook (hooks de git):**
   ```bash
   npx lefthook install
   ```

## Flujo de Trabajo

### 1. Crear una rama

Siempre crea una rama nueva para tu trabajo:

```bash
git checkout -b tipo/descripcion-corta
```

Tipos de rama:

- `feat/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización
- `test/` - Tests

Ejemplo: `feat/add-payment-integration`

### 2. Hacer cambios

Mientras desarrollas:

```bash
# Ejecutar backend
npm run dev:backend

# Ejecutar frontend (en otra terminal)
npm run dev:frontend

# O ejecutar ambos
npm run dev
```

### 3. Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial limpio.

**Formato:**

```
<tipo>(<scope>): <descripción>

[cuerpo opcional]

[footer opcional]
```

**Tipos:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Solo documentación
- `style`: Formateo (sin cambios de código)
- `refactor`: Refactorización
- `perf`: Mejora de performance
- `test`: Agregar o corregir tests
- `build`: Cambios en build system
- `ci`: Cambios en CI/CD
- `chore`: Tareas de mantenimiento

**Ejemplos:**

```bash
git commit -m "feat(orders): add filter by date range"
git commit -m "fix(upload): resolve file size validation bug"
git commit -m "docs: update API documentation"
```

**Commitlint validará automáticamente tus commits** usando el hook `commit-msg`.

### 4. Pre-commit hooks

Lefthook ejecuta automáticamente estos checks **antes de cada commit**:

- **Lint**: Verifica código TypeScript
- **Prettier**: Formatea el código automáticamente
- **Stage fixed**: Agrega los archivos formateados al commit

Si algún check falla, el commit se cancela. Corrige los errores y vuelve a intentar.

### 5. Pre-push hooks

Antes de hacer push, Lefthook ejecuta:

- **Build backend**: Verifica que el backend compile
- **Build frontend**: Verifica que el frontend compile

Si algo falla, el push se cancela.

### 6. Crear Pull Request

1. Push tu rama:

   ```bash
   git push origin tu-rama
   ```

2. Ve a GitHub y crea un Pull Request

3. Describe tus cambios:
   - Qué hace el PR
   - Por qué es necesario
   - Cómo probarlo
   - Screenshots (si aplica)

## Estructura del Código

### Backend (NestJS)

```
apps/backend/src/
├── prisma/          # Prisma service y configuración
├── orders/          # Módulo de pedidos
├── files/           # Módulo de archivos
├── pricing/         # Módulo de precios
└── common/          # Guardas, decoradores, etc.
```

### Frontend (Next.js)

```
apps/frontend/
├── app/             # Páginas (App Router)
├── components/      # Componentes reutilizables
└── lib/             # Utilidades y API client
```

## Estándares de Código

### TypeScript

- Usar tipos explícitos cuando sea necesario
- Evitar `any`
- Usar interfaces para objetos complejos

### React

- Usar hooks cuando sea posible
- Componentes funcionales > componentes de clase
- Nombrar componentes en PascalCase

### Estilo

- 2 espacios de indentación
- Single quotes
- Semicolons
- Prettier se ejecuta automáticamente

## Testing

```bash
# Backend tests
cd apps/backend
npm run test

# E2E tests
npm run test:e2e
```

## Base de Datos

### Crear una nueva migración

```bash
cd apps/backend
npx prisma migrate dev --name descripcion-del-cambio
```

### Ejecutar seed

```bash
npx prisma db seed
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

## Debugging

VS Code está configurado con launch configurations:

- **Debug Backend**: F5 para debuggear el backend
- **Debug Frontend**: F5 para debuggear el frontend
- **Debug Full Stack**: Debuggea ambos a la vez

## Tareas Comunes (VS Code)

Presiona `Cmd+Shift+P` (Mac) o `Ctrl+Shift+P` (Windows/Linux) y busca:

- `Tasks: Run Task`
- Selecciona la tarea que necesites

Tareas disponibles:

- Start Backend (Dev)
- Start Frontend (Dev)
- Start Full Stack
- Build Backend
- Build Frontend
- Prisma: Generate Client
- Prisma: Migrate Dev
- Prisma: Seed Database
- Prisma: Studio

## Resolución de Problemas

### Los hooks no se ejecutan

```bash
npx lefthook install
```

### Error en migraciones de Prisma

```bash
# Reset database (¡cuidado en producción!)
npx prisma migrate reset

# O aplicar manualmente
npx prisma migrate deploy
```

### Problemas con node_modules

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Recursos

- [Documentación de NestJS](https://docs.nestjs.com/)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Lefthook](https://github.com/evilmartians/lefthook)

## ¿Preguntas?

Abre un [Issue](https://github.com/valentinrz14/grafica-system/issues) o contacta al equipo.

¡Gracias por contribuir! 🚀
