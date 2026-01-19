# Production Deployment Guide

## Overview

This guide covers best practices and configurations for deploying the Gráfica System backend to production.

## Environment Variables

### Required Variables

Copy `.env.example` to `.env` and configure the following:

```bash
# Database
DATABASE_URL="postgresql://..." # Your production database URL

# Application
NODE_ENV="production"
PORT=4000 # Railway sets this automatically
UPLOAD_DIR="./uploads"
FRONTEND_URL="https://your-frontend-domain.com" # Or comma-separated: "https://domain1.com,https://domain2.com"

# JWT
JWT_SECRET="<generate-secure-32-byte-random-string>"
JWT_EXPIRATION="8h"

# Email (Gmail SMTP)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="<16-char-app-password>"
MAIL_FROM_NAME="Your App Name"
MAIL_FROM_ADDRESS="your-email@gmail.com"
```

### Generating Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Railway Deployment

### Initial Setup

1. **Create Railway Project**

   ```bash
   railway init
   ```

2. **Add PostgreSQL Database**
   - Go to Railway dashboard
   - Add "New" → "Database" → "PostgreSQL"
   - Copy `DATABASE_URL` to your environment variables

3. **Configure Environment Variables**
   - In Railway dashboard, go to your service
   - Navigate to "Variables" tab
   - Add all required environment variables from `.env.example`
   - **Important**: Do NOT manually set `PORT` - Railway handles this automatically

4. **Deploy**
   ```bash
   git push origin main
   ```
   Railway will automatically detect and deploy your application.

### Health Checks

Railway automatically monitors the `/health` endpoint configured in `railway.toml`:

- **Path**: `/health`
- **Timeout**: 300 seconds
- **Expected Response**: `{ "status": "ok", ... }`

### Restart Policy

The application is configured to restart automatically on failures:

- **Type**: `ON_FAILURE`
- **Max Retries**: 10

## Performance Optimizations

### 1. Compression

HTTP responses are automatically compressed using gzip/deflate via the `compression` middleware.

- **Benefit**: Reduces bandwidth usage by 60-80%
- **Configuration**: `src/main.ts` line 24

### 2. Database Connection Pooling

Neon PostgreSQL (via DATABASE_URL) handles connection pooling automatically.

- **Recommended**: Use pooled connection string for production
- **Format**: `postgresql://user:pass@host-pooler.region.aws.neon.tech/db`

### 3. Logging

Log levels are automatically adjusted based on `NODE_ENV`:

- **Production**: `['log', 'error', 'warn']` - reduces noise
- **Development**: `['log', 'error', 'warn', 'debug', 'verbose']` - full logging

### 4. Prisma Query Optimization

Prisma logs are minimized in production:

- **Production**: Only errors and warnings
- **Development**: Full query logging for debugging

## Security

### 1. Helmet

Security headers are enabled via `helmet` middleware:

- Content Security Policy (production only)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

### 2. CORS

CORS is configured to accept requests only from whitelisted origins:

```typescript
// Supports multiple origins (comma-separated in FRONTEND_URL)
origin: ['https://your-frontend.com', 'https://www.your-frontend.com'];
```

### 3. Rate Limiting

Rate limiting via `@nestjs/throttler`:

- **Limit**: 200 requests per 60 seconds per IP
- **Applied**: Globally to all endpoints
- **Override**: Use `@SkipThrottle()` or `@Throttle()` decorators on specific routes

### 4. Input Validation

Global validation pipe with strict rules:

- **Whitelist**: Strips unknown properties from DTOs
- **ForbidNonWhitelisted**: Throws error if unknown properties are sent
- **Transform**: Auto-transforms types (e.g., string "true" → boolean true)

## Monitoring

### Application Logs

View logs in Railway dashboard:

```bash
railway logs
```

Or use Railway CLI:

```bash
railway logs --follow
```

### Key Metrics to Monitor

1. **Response Time**: Health check should respond in < 100ms
2. **Error Rate**: Monitor for `❌` emojis in logs
3. **Database Connection**: Look for "Database connection established successfully"
4. **Memory Usage**: Railway shows memory graphs in dashboard

### Error Tracking

All uncaught exceptions and unhandled promise rejections are logged:

```
❌ Uncaught Exception: [error details]
❌ Unhandled Rejection at: [promise details]
```

## Graceful Shutdown

The application handles `SIGTERM` and `SIGINT` signals gracefully:

1. Stops accepting new connections
2. Closes database connections
3. Waits for ongoing requests to complete
4. Exits cleanly

```
SIGTERM received. Starting graceful shutdown...
✅ Application closed successfully
```

## Database Migrations

Migrations run automatically on each deployment:

```bash
npx prisma migrate deploy && node dist/main
```

To create a new migration:

```bash
npx prisma migrate dev --name your_migration_name
```

## Rollback Strategy

If a deployment fails:

1. **Railway Auto-Rollback**: Railway keeps previous successful deployment
2. **Manual Rollback**: In Railway dashboard, select a previous deployment and "Redeploy"
3. **Database Rollback**:
   ```bash
   npx prisma migrate resolve --rolled-back migration_name
   ```

## Email Configuration (Mailgun)

This application uses **Mailgun** for email delivery, which works perfectly with Railway (no SMTP port blocking issues).

### Setup Mailgun (Free - 5 minutes)

1. **Create Free Account**: Visit https://signup.mailgun.com/new/signup
   - Sign up with email
   - Free tier: 5,000 emails/month (no credit card required for first month)

2. **Get API Key and Domain**:
   - Go to **Sending** → **Domain settings** in dashboard
   - Under "Sandbox domains", you'll see your sandbox domain (e.g., `sandbox-abc123.mailgun.org`)
   - Click on it to see the API key
   - Copy both the **API key** (starts with `key-`) and the **domain**

3. **Add Authorized Recipients** (for sandbox domain):
   - In the domain settings, scroll to "Authorized Recipients"
   - Add the email addresses you want to test with
   - Each recipient will receive a verification email
   - Click the verification link in the email

4. **Add to Railway**:
   - Go to your Railway service → **Variables** tab
   - Add variables:
     - `MAILGUN_API_KEY=key_your_api_key_here`
     - `MAILGUN_DOMAIN=sandbox-xxx.mailgun.org`
     - `MAIL_FROM_NAME=Gráfica System`
     - `MAIL_FROM_ADDRESS=noreply@sandbox-xxx.mailgun.org`
   - Railway will auto-redeploy

### Environment Variables

```bash
# Required
MAILGUN_API_KEY="key_abc123xyz..." # From Mailgun dashboard
MAILGUN_DOMAIN="sandbox-xxx.mailgun.org" # Your sandbox domain

# Optional (for customization)
MAIL_FROM_NAME="Gráfica System" # Display name in emails
MAIL_FROM_ADDRESS="noreply@sandbox-xxx.mailgun.org" # Use your sandbox/verified domain
```

### Testing Email Delivery

1. **Test in development**:

   ```bash
   # Create a test order through the app
   # Check logs for:
   # ✅ Mailgun email service configured successfully
   # ✅ Order confirmation email sent successfully (ID: xxx)
   ```

2. **Test in production**:

   ```bash
   # Create an order
   # Check Railway logs:
   railway logs | grep "email sent"

   # Or check in Mailgun dashboard → Logs tab
   # You'll see delivery status, opens, clicks, etc.
   ```

### Sandbox vs Verified Domain

**Sandbox Domain** (Free tier):

- Can send to **authorized recipients only** (must verify each email)
- Perfect for testing and development
- No domain verification required
- Limited to 5,000 emails/month

**Verified Domain** (Production):

- Can send to **any recipient**
- Requires domain ownership verification
- Better deliverability
- Required for production use

To verify a domain:

1. Go to **Sending** → **Domains** → **Add New Domain**
2. Follow DNS verification steps
3. Update `MAILGUN_DOMAIN` and `MAIL_FROM_ADDRESS` to use your domain

### Why Mailgun over Gmail SMTP?

| Feature              | Gmail SMTP  | Mailgun        |
| -------------------- | ----------- | -------------- |
| **Works on Railway** | ❌ Blocked  | ✅ Yes         |
| **Free Tier**        | ❌ None     | ✅ 5,000/month |
| **Setup Time**       | 10 minutes  | 5 minutes      |
| **Deliverability**   | ⭐⭐⭐      | ⭐⭐⭐⭐⭐     |
| **Tracking**         | ❌ No       | ✅ Yes         |
| **API**              | SMTP (slow) | HTTP (fast)    |

### Troubleshooting

**Issue**: Emails not sending

**Check logs for**:

```
⚠️  Email not configured. Set MAILGUN_API_KEY...
```

**Solution**:

1. Verify `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` are set in Railway variables
2. Check the API key is valid (starts with `key-`)
3. Check Mailgun dashboard → Logs for errors

**Issue**: "Forbidden: sandbox domain only allows authorized recipients"

**Solution**:

1. Go to Mailgun dashboard → Your sandbox domain
2. Scroll to "Authorized Recipients"
3. Add the recipient email address
4. Verify the email (click link sent to recipient)

OR:

1. Verify your own domain in Mailgun
2. Update `MAILGUN_DOMAIN` and `MAIL_FROM_ADDRESS` to use your domain

## Performance Benchmarks

Expected performance on Railway:

- **Cold Start**: < 3 seconds
- **Health Check**: < 50ms
- **Database Query (simple)**: < 20ms
- **Database Query (complex with joins)**: < 100ms
- **File Upload (1MB)**: < 500ms

## Troubleshooting

### Issue: 502 Bad Gateway

**Symptoms**: Railway shows health check passed, but browser returns 502

**Causes**:

1. Port mismatch (app not reading `PORT` env var)
2. App crashing after startup
3. Missing public domain configuration

**Solution**:

```bash
# Check logs
railway logs

# Verify PORT is being read correctly
# Look for: "🚀 Application is running on: http://0.0.0.0:XXXX"

# Verify domain is configured
# Railway dashboard → Settings → Networking → Generate Domain
```

### Issue: Database Connection Failed

**Symptoms**: "Failed to connect to database" in logs

**Solution**:

```bash
# Verify DATABASE_URL is correct
railway variables

# Test connection locally
npx prisma db push --skip-generate

# Check if Neon database is paused (free tier)
# Visit Neon dashboard and wake it up
```

### Issue: High Memory Usage

**Symptoms**: App restarting frequently, "Out of memory" errors

**Solution**:

1. Check for memory leaks in custom code
2. Optimize Prisma queries (use `select` to limit fields)
3. Upgrade Railway plan for more memory

## Cost Optimization

### Free Tier (Railway)

- **Execution Time**: 500 hours/month
- **Suitable For**: Development, staging, low-traffic production

### Pro Plan ($5/month)

- **Execution Time**: Unlimited
- **Suitable For**: Production with consistent traffic

### Database (Neon Free Tier)

- **Storage**: 512 MB
- **Auto-pause**: After 5 minutes of inactivity
- **Suitable For**: Small applications (< 10k records)

## Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a cryptographically secure random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure `FRONTEND_URL` with your actual domain(s)
- [ ] Use Gmail App Password (not regular password)
- [ ] Enable HTTPS (Railway does this automatically)
- [ ] Review and adjust rate limits if needed
- [ ] Set up database backups (Neon Pro plan or manual exports)
- [ ] Configure custom domain with CNAME record
- [ ] Test all endpoints with production data
- [ ] Monitor logs for first 24 hours after launch

## Support

- **Railway Documentation**: https://docs.railway.com
- **NestJS Documentation**: https://docs.nestjs.com
- **Prisma Documentation**: https://www.prisma.io/docs
- **Neon Documentation**: https://neon.tech/docs

---

**Last Updated**: 2026-01-19
