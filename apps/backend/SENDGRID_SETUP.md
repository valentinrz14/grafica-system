# SendGrid Setup - Guía Rápida (3 minutos)

## ¿Por qué SendGrid?

- ✅ **100% GRATIS** - 100 emails/día = 3,000 emails/mes (para siempre)
- ✅ **SIN dominio propio requerido** - Funciona con cualquier email
- ✅ **SIN autorizar destinatarios** - Envía a cualquier email sin restricciones
- ✅ **SIN tarjeta de crédito**
- ✅ Compatible con Railway (HTTP API, no SMTP)

## Paso 1: Crear Cuenta (1 minuto)

1. Ve a: **https://signup.sendgrid.com**
2. Registrate con tu email
3. Revisa tu inbox y verifica tu cuenta (click en el link)

## Paso 2: Verificar tu Email como Sender (1 minuto)

1. En el dashboard de SendGrid, ve a **Settings** → **Sender Authentication**
2. Click en **"Get Started"** bajo "Single Sender Verification"
3. Llena el formulario:
   - **From Name**: `Gráfica System`
   - **From Email Address**: `grafica.notificaciones@gmail.com` (tu email)
   - **Reply To**: `grafica.notificaciones@gmail.com` (mismo email)
   - **Company Address**: Cualquier dirección
   - **City**: Tu ciudad
   - **Country**: Argentina
4. Click **"Create"**
5. Revisa tu email (`grafica.notificaciones@gmail.com`) y click en el link de verificación

## Paso 3: Crear API Key (1 minuto)

1. Ve a **Settings** → **API Keys**
2. Click **"Create API Key"**
3. **Name**: `Production Backend`
4. **API Key Permissions**: Selecciona **"Full Access"** (o al menos "Mail Send")
5. Click **"Create & View"**
6. **COPIA LA API KEY** (empieza con `SG.`) - ¡Solo la verás una vez!
   - Ejemplo: `SG.abc123xyz456...`

## Paso 4: Configurar en Railway

1. Ve a tu proyecto en Railway
2. Click en tu servicio backend
3. Click en la pestaña **"Variables"**
4. Agrega estas variables:

```
SENDGRID_API_KEY=SG.tu_api_key_aqui
MAIL_FROM_NAME=Gráfica System
MAIL_FROM_ADDRESS=grafica.notificaciones@gmail.com
```

5. Railway redesplegará automáticamente

## Paso 5: Configurar Localmente

Actualiza tu archivo `.env` en `apps/backend/.env`:

```bash
SENDGRID_API_KEY="SG.tu_api_key_aqui"
MAIL_FROM_NAME="Gráfica System"
MAIL_FROM_ADDRESS="grafica.notificaciones@gmail.com"
```

## Paso 6: Probar

1. Inicia tu backend:

   ```bash
   npm run start:dev
   ```

2. Verifica en los logs:

   ```
   ✅ SendGrid email service configured successfully
   ```

3. Crea un pedido de prueba en tu app

4. Deberías recibir el email de confirmación

5. Revisa el dashboard de SendGrid → **Activity** para ver el email enviado

## Límites y Restricciones

**Free Tier:**

- ✅ 100 emails/día
- ✅ 3,000 emails/mes
- ✅ Sin costo NUNCA
- ✅ Sin tarjeta de crédito requerida

**Restricciones:**

- ❌ Ninguna - Envías a cualquier destinatario sin autorizar
- ❌ No requiere dominio propio

## Troubleshooting

### Error: "Email not configured"

**Logs:**

```
⚠️ Email not configured. Set SENDGRID_API_KEY...
```

**Solución:**

- Verifica que `SENDGRID_API_KEY` esté configurada en Railway/local
- Verifica que la API key empiece con `SG.`

### Error: "The from address does not match a verified Sender Identity"

**Solución:**

1. Ve a SendGrid → **Settings** → **Sender Authentication**
2. Verifica que tu email (`grafica.notificaciones@gmail.com`) esté verificado
3. Si no está verificado, revisa tu inbox por el email de verificación
4. El email en `MAIL_FROM_ADDRESS` debe ser EXACTAMENTE el mismo que verificaste

### Los emails llegan a spam

**Soluciones:**

1. Asegúrate que el sender email esté verificado
2. No uses palabras spam en el subject (GRATIS, URGENTE, etc.)
3. Incluye un unsubscribe link en el footer del email
4. Si tenés dominio propio, verificalo con SPF/DKIM en SendGrid

## Ventajas sobre otras opciones

| Feature              | Gmail SMTP | Resend    | Mailgun   | SendGrid  |
| -------------------- | ---------- | --------- | --------- | --------- |
| Funciona en Railway  | ❌         | ✅        | ✅        | ✅        |
| Free tier            | ❌         | ✅ 3K/mes | ✅ 5K/mes | ✅ 3K/mes |
| Requiere dominio     | ❌         | ✅        | ✅        | ❌        |
| Autorizar recipients | ❌         | ✅        | ✅        | ❌        |
| Setup time           | 10 min     | 5 min     | 5 min     | **3 min** |

**SendGrid es la mejor opción porque:**

- ✅ No requiere dominio propio (funciona con subdominios de Railway/Vercel)
- ✅ No requiere autorizar cada destinatario
- ✅ Setup más rápido (solo verificar tu email)
- ✅ 100% gratis sin restricciones molestas

## Recursos

- **Dashboard**: https://app.sendgrid.com
- **Documentación**: https://docs.sendgrid.com
- **Status**: https://status.sendgrid.com

---

**¿Listo?** Con SendGrid configurado, tu app ya puede enviar emails de confirmación de pedidos a cualquier cliente sin restricciones.
