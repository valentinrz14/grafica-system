# Configuración de Base de Datos PostgreSQL

## ⚠️ IMPORTANTE

El sistema **REQUIERE** una base de datos PostgreSQL real para funcionar. El archivo `.env` tiene un placeholder que **DEBES** reemplazar con una URL de conexión válida.

## Opción 1: Railway (Recomendado - Más rápido)

### 1. Crear cuenta en Railway

Ir a [railway.app](https://railway.app/) y crear cuenta (gratis)

### 2. Crear proyecto PostgreSQL

1. Click en "New Project"
2. Seleccionar "Provision PostgreSQL"
3. Esperar a que se cree la base de datos

### 3. Obtener la URL de conexión

1. Click en tu base de datos PostgreSQL
2. Ir a la pestaña "Connect"
3. Copiar el "Postgres Connection URL"

Ejemplo de URL que verás:

```
postgresql://postgres:TuPasswordAqui123@containers-us-west-123.railway.app:5432/railway
```

### 4. Actualizar .env

```bash
cd apps/backend
nano .env  # o usar cualquier editor
```

Reemplazar:

```env
DATABASE_URL="postgresql://user:password@host:5432/grafica_db?schema=public"
```

Por tu URL de Railway:

```env
DATABASE_URL="postgresql://postgres:TuPasswordAqui123@containers-us-west-123.railway.app:5432/railway"
```

### 5. Ejecutar migraciones

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed
```

✅ ¡Listo! Railway está configurado.

---

## Opción 2: Supabase

### 1. Crear cuenta en Supabase

Ir a [supabase.com](https://supabase.com/) y crear cuenta (gratis)

### 2. Crear proyecto

1. Click en "New Project"
2. Nombrar tu proyecto (ej: "grafica-system")
3. Crear password segura (¡guárdala!)
4. Elegir región (ej: South America)
5. Esperar 2-3 minutos mientras se crea

### 3. Obtener la URL de conexión

1. En tu proyecto, ir a Settings → Database
2. Scroll hasta "Connection string"
3. Seleccionar "URI" (no "Transaction pooling")
4. Copiar la URL
5. **IMPORTANTE**: Reemplazar `[YOUR-PASSWORD]` con la password que creaste en el paso 2

Ejemplo:

```
postgresql://postgres.xxxxxxxxxxxxx:[TU-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

### 4. Actualizar .env

```bash
cd apps/backend
nano .env
```

Pegar tu URL de Supabase:

```env
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxxx:[TU-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

### 5. Ejecutar migraciones

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed
```

✅ ¡Listo! Supabase está configurado.

---

## Opción 3: PostgreSQL Local (Solo para desarrollo)

### 1. Instalar PostgreSQL

**macOS (con Homebrew):**

```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Descargar de [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

### 2. Crear base de datos

```bash
# Crear usuario y base de datos
psql -U postgres
CREATE USER grafica WITH PASSWORD 'tu_password_segura';
CREATE DATABASE grafica_db OWNER grafica;
\q
```

### 3. Actualizar .env

```env
DATABASE_URL="postgresql://grafica:tu_password_segura@localhost:5432/grafica_db"
```

### 4. Ejecutar migraciones

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

## Verificar que funciona

### 1. Iniciar el backend

```bash
cd apps/backend
npm run start:dev
```

Deberías ver:

```
🚀 Backend running on http://localhost:4000
```

**Sin errores de conexión.**

### 2. Verificar en Prisma Studio

```bash
cd apps/backend
npx prisma studio
```

Deberías ver:

- Tabla `users` con 1 usuario admin
- Tabla `pricing_config` con configuración por defecto
- Tablas `orders` y `order_files` vacías

### 3. Probar el sistema

1. En otra terminal, iniciar frontend:

   ```bash
   cd apps/frontend
   npm run dev
   ```

2. Abrir http://localhost:3000

3. Subir un archivo PDF

4. Deberías ver el precio calculado automáticamente ✅

---

## Solución de Problemas

### Error: "ECONNREFUSED"

❌ El backend no puede conectarse a la base de datos.

**Solución:**

- Verificar que la URL en `.env` sea correcta
- Verificar que la base de datos esté activa (Railway/Supabase)
- Verificar que no haya firewall bloqueando

### Error: "Pricing configuration not found"

❌ La base de datos no tiene los datos iniciales.

**Solución:**

```bash
cd apps/backend
npx prisma db seed
```

### Error: "The table `orders` does not exist"

❌ Las migraciones no se ejecutaron.

**Solución:**

```bash
cd apps/backend
npx prisma migrate dev --name init
```

### Error: "role 'grafica' does not exist" (PostgreSQL local)

❌ El usuario no fue creado correctamente.

**Solución:**

```bash
psql -U postgres
CREATE USER grafica WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE grafica_db TO grafica;
\q
```

---

## Archivos .env Ejemplo Completo

### apps/backend/.env

```env
# Railway ejemplo
DATABASE_URL="postgresql://postgres:abc123xyz@containers-us-west-123.railway.app:5432/railway"

# O Supabase ejemplo
# DATABASE_URL="postgresql://postgres.xxxxx:MiPassword@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# Configuración del backend
PORT=4000
UPLOAD_DIR="./uploads"
FRONTEND_URL="http://localhost:3000"
```

### apps/frontend/.env.local

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## ¿Necesitas ayuda?

Si tenés problemas:

1. Verificar los logs del backend: `npm run start:dev`
2. Verificar que Railway/Supabase estén activos
3. Probar la conexión con Prisma Studio: `npx prisma studio`
4. Abrir un issue en GitHub con el error específico

---

## Free Tiers

**Railway:**

- $5 USD de crédito gratis
- ~500 horas/mes de uso
- Suficiente para desarrollo y testing

**Supabase:**

- 500 MB de storage
- 2 GB de data transfer
- Ilimitadas API requests
- Más que suficiente para empezar

Ambos son gratis para proyectos pequeños y pruebas! 🎉
