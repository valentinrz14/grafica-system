# 📧 Configuración de Email para Notificaciones

## Estado Actual

✅ **El sistema funciona correctamente SIN email configurado**
- Los pedidos se crean normalmente
- Los usuarios no reciben emails de confirmación
- No hay errores en el backend

⚠️ **Para habilitar emails, seguí estos pasos:**

---

## Pasos para Configurar Gmail (5 minutos)

### 1. Crear cuenta de Gmail (2 min)

1. Andá a https://accounts.google.com/signup
2. Creá una cuenta nueva con nombre profesional:
   - Sugerencia: `graficasystem.notificaciones@gmail.com`
   - O cualquier nombre que prefieras
3. Completá el registro (te va a pedir número de teléfono)

---

### 2. Habilitar Verificación en 2 Pasos (1 min)

1. Andá a https://myaccount.google.com/security
2. Hacé clic en **"Verificación en 2 pasos"**
3. Hacé clic en **"Empezar"** y seguí los pasos
4. Confirmá con tu teléfono

---

### 3. Generar App Password (2 min)

1. Andá a https://myaccount.google.com/apppasswords
   - O desde Security, buscá "App passwords"
2. Configurá:
   - **Select app**: Mail
   - **Select device**: Other (Custom name)
   - **Name**: `Grafica System Backend`
3. Hacé clic en **"Generate"**
4. **COPIÁ la contraseña de 16 caracteres** (aparece así: `xxxx xxxx xxxx xxxx`)

---

### 4. Actualizar el archivo .env

Abrí el archivo `/apps/backend/.env` y reemplazá estas líneas:

```env
# Reemplazá estos valores:
GMAIL_USER=tu-email-nuevo@gmail.com
GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
MAIL_FROM_NAME="Gráfica System"
MAIL_FROM_ADDRESS=tu-email-nuevo@gmail.com
```

**⚠️ Importante:**
- En `GMAIL_APP_PASSWORD` pegá la contraseña de 16 caracteres **SIN ESPACIOS**
- Ejemplo: `abcdabcdabcdabcd` (no `abcd abcd abcd abcd`)

---

### 5. Reiniciar el servidor

```bash
cd apps/backend
npm run start:dev
```

Deberías ver este mensaje en la consola:
```
✅ Email transporter configured successfully
```

---

## Probar que funciona

1. Andá al frontend: http://localhost:3000
2. Iniciá sesión
3. Creá un pedido de prueba
4. Verificá que recibiste el email de confirmación en tu bandeja de entrada

---

## Troubleshooting

### Error: "Invalid login: 535"
❌ La contraseña no es correcta
✅ Solución: Generá una nueva App Password y copiala sin espacios

### Error: "EAUTH"
❌ El usuario o contraseña están mal
✅ Solución: Verificá que copiaste bien el email y la App Password

### No llegan los emails
❌ Revisá la carpeta de Spam
❌ Verificá que el email del destinatario sea correcto
✅ Entrá a la cuenta de Gmail que creaste y mirá en "Enviados"

---

## Límites de Gmail

📊 Gmail gratuito permite **500 emails por día**

Si tu negocio crece y necesitás más:
- **SendGrid**: 100 emails/día gratis
- **AWS SES**: $0.10 por cada 1000 emails
- **Mailgun**: 5000 emails/mes gratis

---

## ¿Necesitás ayuda?

Si tenés problemas, avisame y te ayudo a resolverlos paso a paso.

---

**Última actualización**: 13/01/2026
