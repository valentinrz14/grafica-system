# 🚀 Guía de Deploy a Producción

Esta guía te llevará paso a paso para deployar tu aplicación en producción usando:

- **Frontend**: Vercel (gratis)
- **Backend**: Railway (~$5/mes)
- **Base de datos**: Neon PostgreSQL (gratis)

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

- [x] Cuenta de GitHub con el repositorio del proyecto
- [x] Cuenta de Vercel (https://vercel.com)
- [x] Cuenta de Railway (https://railway.app)
- [x] Cuenta de Neon (https://neon.tech)
- [x] Gmail configurado con App Password para notificaciones

---

## 🗄️ Paso 1: Configurar Base de Datos en Neon

### 1.1 Crear Proyecto en Neon

1. Ve a https://neon.tech y crea una cuenta
2. Click en **"Create a project"**
3. Configuración:
   - **Name**: `grafica-system`
   - **PostgreSQL version**: 16 (o la más reciente)
   - **Region**: Elige la más cercana a tus usuarios
4. Click **"Create project"**

### 1.2 Obtener Connection String

1. En el dashboard de tu proyecto, ve a **"Connection Details"**
2. Copia el **Connection String** (Pooled connection)
3. Debería verse así:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. **Guarda esta URL**, la necesitarás para Railway

### 1.3 Configurar Database

En la terminal de Neon SQL Editor o usando tu cliente SQL favorito, ejecuta:

```sql
-- Verificar que la base de datos esté vacía
SELECT * FROM pg_tables WHERE schemaname = 'public';
```

**No es necesario crear tablas manualmente** - Prisma lo hará automáticamente con las migraciones.

---

## 🚂 Paso 2: Deploy del Backend en Railway

### 2.1 Crear Proyecto en Railway

1. Ve a https://railway.app y crea una cuenta
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tu GitHub
5. Selecciona el repositorio `grafica-system`

### 2.2 Configurar Servicio del Backend

1. Railway detectará automáticamente que hay múltiples apps
2. Click en **"Add Service"** → **"GitHub Repo"**
3. En **Settings**:
   - **Root Directory**: `apps/backend`
   - **Build Command**: Dejar vacío (usa railway.json)
   - **Start Command**: Dejar vacío (usa railway.json)

**IMPORTANTE**: El proyecto es un **monorepo con workspaces** y usa **Yarn**. Los archivos `railway.json` y `nixpacks.toml` están configurados para:

1. Instalar dependencias desde la raíz del monorepo con `yarn install --frozen-lockfile`
2. Generar el Prisma Client
3. Ejecutar migraciones
4. Construir el backend con `yarn build`

### 2.3 Configurar Variables de Entorno

En la pestaña **Variables**, agrega estas variables:

```bash
# Database (usa la URL de Neon)
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Backend
PORT=4000
UPLOAD_DIR=./uploads
NODE_ENV=production

# Frontend URL (la configuraremos después)
FRONTEND_URL=https://tu-app.vercel.app

# JWT (genera uno nuevo con: openssl rand -base64 32)
JWT_SECRET=tu-secreto-muy-largo-y-aleatorio-aqui
JWT_EXPIRATION=8h

# Email (Gmail)
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM_NAME=Gráfica System
MAIL_FROM_ADDRESS=tu-email@gmail.com
```

### 2.4 Verificar el Despliegue

Después del primer deploy:

1. Ve a la pestaña **"Deploy Logs"**
2. Verifica que el build se complete exitosamente
3. Las migraciones de Prisma se ejecutan automáticamente gracias a `railway.json`
4. Si hay errores, verifica las variables de entorno (especialmente `DATABASE_URL`)

### 2.5 Ejecutar Seed (Opcional pero recomendado)

Para crear el usuario admin inicial:

1. Ve a la pestaña **"Settings" → "Service"**
2. En **"Start Command"** temporalmente cambia a:
   ```bash
   yarn prisma:seed && yarn start:prod
   ```
3. Redeploya
4. Una vez completado el seed, vuelve a cambiar a:
   ```bash
   yarn start:prod
   ```

**Nota**: El seed creará un usuario admin con:

- Email: `admin@grafica.com`
- Password: `Admin123!`

### 2.6 Obtener URL del Backend

1. Ve a **"Settings" → "Networking"**
2. Click en **"Generate Domain"**
3. Copia la URL generada (ej: `grafica-backend-production.up.railway.app`)
4. **Guarda esta URL**, la necesitarás para Vercel

### 2.7 Configurar CORS

Actualiza la variable `FRONTEND_URL` con la URL de Vercel (la configuraremos en el siguiente paso):

```bash
FRONTEND_URL=https://tu-app.vercel.app
```

---

## ▲ Paso 3: Deploy del Frontend en Vercel

### 3.1 Importar Proyecto

1. Ve a https://vercel.com/dashboard
2. Click en **"Add New..." → "Project"**
3. Importa el repositorio `grafica-system` desde GitHub
4. Vercel detectará automáticamente Next.js

### 3.2 Configurar el Proyecto

En la configuración del proyecto:

1. **Framework Preset**: Next.js (detectado automáticamente)
2. **Root Directory**: Cambia a `apps/frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 3.3 Configurar Variables de Entorno

En **"Environment Variables"**, agrega:

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
```

⚠️ **Importante**: Usa la URL de Railway del paso 2.6

### 3.4 Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build (1-3 minutos)
3. Una vez completado, obtendrás una URL como: `tu-app.vercel.app`

### 3.5 Configurar Dominio Personalizado (Opcional)

1. Ve a **"Settings" → "Domains"**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

---

## 🔄 Paso 4: Configuración Final

### 4.1 Actualizar CORS en Backend

1. Regresa a Railway
2. Actualiza la variable `FRONTEND_URL`:
   ```bash
   FRONTEND_URL=https://tu-app.vercel.app
   ```
3. Redeploya el backend

### 4.2 Verificar Conexiones

Prueba que todo funcione:

1. **Frontend**: Abre `https://tu-app.vercel.app`
2. **Backend Health Check**: Abre `https://tu-backend.railway.app` (debería mostrar "Hello World" o similar)
3. **Crear usuario**: Regístrate en el frontend
4. **Login**: Inicia sesión
5. **Crear pedido**: Prueba el flujo completo

### 4.3 Credenciales de Admin

Si ejecutaste el seed, puedes acceder como admin:

```
Email: admin@grafica.com
Password: Admin123!
```

---

## 🔧 Configuración Adicional

### Gmail App Password

Para que funcionen las notificaciones por email:

1. Ve a tu **Google Account** → **Security**
2. Activa **2-Step Verification** si no lo tienes
3. Ve a **Security** → **App passwords**
4. Crea una nueva app password:
   - App: Mail
   - Device: Other (Grafica System Backend)
5. Copia el password de 16 caracteres
6. Agrégalo a Railway como `GMAIL_APP_PASSWORD`

### JWT Secret

Genera un secret seguro:

```bash
# En tu terminal local
openssl rand -base64 32
```

Copia el resultado y agrégalo como `JWT_SECRET` en Railway.

---

## 📊 Monitoreo y Logs

### Railway Logs

- Ve a tu proyecto en Railway
- Click en el servicio del backend
- Pestaña **"Deployments" → "View Logs"**

### Vercel Logs

- Ve a tu proyecto en Vercel
- Click en una deployment
- Pestaña **"Functions"** para ver logs de API routes

### Neon Monitoring

- Dashboard de Neon
- Sección **"Monitoring"**
- Puedes ver queries, performance, etc.

---

## 🐛 Troubleshooting

### Backend no se conecta a la base de datos

- Verifica que la `DATABASE_URL` esté correcta
- Asegúrate de que incluye `?sslmode=require` al final
- Revisa los logs de Railway para errores de Prisma

### Frontend no puede llamar al backend

- Verifica que `NEXT_PUBLIC_API_URL` esté correcta
- Debe empezar con `https://`
- Debe apuntar a la URL de Railway

### CORS errors

- Verifica que `FRONTEND_URL` en Railway apunte a tu URL de Vercel
- No incluyas el `/` al final
- Debe ser exactamente igual a la URL de Vercel

### Migraciones no se aplican

```bash
# En Railway, ejecuta manualmente:
npx prisma migrate deploy
```

### Emails no se envían

- Verifica `GMAIL_APP_PASSWORD` (16 caracteres sin espacios)
- Verifica que `GMAIL_USER` sea correcto
- Revisa logs de Railway para errores de Nodemailer

---

## 💰 Costos Estimados

| Servicio    | Plan          | Costo       | Límites                                    |
| ----------- | ------------- | ----------- | ------------------------------------------ |
| **Vercel**  | Hobby         | **$0/mes**  | 100GB bandwidth, builds ilimitados         |
| **Railway** | Pay-as-you-go | **~$5/mes** | $5 gratis mensual, luego $0.000463/GB-hora |
| **Neon**    | Free          | **$0/mes**  | 0.5GB storage, 1 proyecto                  |
| **Gmail**   | Free          | **$0/mes**  | 500 emails/día                             |

**Total estimado**: **~$0-5/mes** dependiendo del tráfico

---

## 🔄 Actualizaciones Futuras

Cuando hagas cambios en el código:

1. **Commit y push** a GitHub
2. **Vercel** se autodeploya automáticamente
3. **Railway** se autodeploya automáticamente

Si necesitas ejecutar migraciones nuevas:

1. Railway → Settings → Build Command
2. Agrega: `npx prisma migrate deploy` antes del build
3. Redeploya

---

## 📚 Recursos Adicionales

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Deploy Docs](https://www.prisma.io/docs/guides/deployment)

---

## ✅ Checklist Final

Antes de considerar el deploy completo:

- [ ] Base de datos creada en Neon
- [ ] Backend deployado en Railway
- [ ] Migraciones de Prisma ejecutadas
- [ ] Seed ejecutado (usuario admin creado)
- [ ] Frontend deployado en Vercel
- [ ] Variables de entorno configuradas en ambos
- [ ] CORS configurado correctamente
- [ ] Gmail App Password configurado
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Creación de pedidos funciona
- [ ] Notificaciones por email funcionan
- [ ] Panel de admin accesible

---

**¡Felicidades! 🎉 Tu aplicación está en producción.**

Si tienes problemas, revisa los logs en Railway y Vercel, o contacta al equipo de soporte de cada plataforma.
