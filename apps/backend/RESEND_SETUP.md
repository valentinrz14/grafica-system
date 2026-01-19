# Resend Email Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Resend Account

1. Visit: **https://resend.com**
2. Click **"Sign Up"** (free, no credit card required)
3. Sign up with GitHub or email

### Step 2: Get Your API Key

1. Once logged in, go to **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name: `"Gráfica System Production"`
4. Click **"Create"**
5. **Copy the key** (starts with `re_`) - you won't see it again!

   Example: `re_AbCdEfGh123456789`

### Step 3: Add to Railway

#### Option A: Through Railway Dashboard

1. Go to your Railway project
2. Select your backend service
3. Click **"Variables"** tab
4. Click **"+ New Variable"**
5. Add:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_your_key_here` (paste the key you copied)
6. Click **"Add"**
7. Railway will automatically redeploy

#### Option B: Through Railway CLI

```bash
railway variables set RESEND_API_KEY=re_your_key_here
```

### Step 4: Optional - Customize Sender

By default, emails will be sent from `onboarding@resend.dev` with your app name.

To use a custom email address:

1. In Railway variables, add:

   ```
   MAIL_FROM_ADDRESS=noreply@yourdomain.com
   MAIL_FROM_NAME=Your Custom Name
   ```

2. **Important**: You must verify your domain in Resend first:
   - Go to Resend dashboard → **"Domains"**
   - Click **"Add Domain"**
   - Follow DNS verification steps

### Step 5: Test

1. **Deploy and check logs**:

   ```bash
   railway logs
   # Look for: ✅ Resend email service configured successfully
   ```

2. **Create a test order** in your application

3. **Check email was sent**:
   - Check Railway logs for: `✅ Order confirmation email sent successfully`
   - OR check Resend dashboard → **"Emails"** tab to see sent emails

## Free Tier Limits

Resend free tier includes:

- ✅ **100 emails per day**
- ✅ **3,000 emails per month**
- ✅ All features (tracking, webhooks, etc.)
- ✅ No credit card required

## Local Development

For local testing, add to your `.env` file:

```bash
# Get this from https://resend.com/api-keys
RESEND_API_KEY="re_your_key_here"
MAIL_FROM_NAME="Gráfica System"
MAIL_FROM_ADDRESS="onboarding@resend.dev"
```

Then run:

```bash
npm run start:dev
```

## Pricing (When You Scale)

If you exceed free tier limits:

| Plan | Price     | Emails        |
| ---- | --------- | ------------- |
| Free | $0/month  | 3,000/month   |
| Pro  | $20/month | 50,000/month  |
| Pro+ | $80/month | 150,000/month |

## Verify It's Working

### Check 1: Application Startup

When your app starts, you should see in logs:

```
✅ Resend email service configured successfully
```

If you see this instead:

```
⚠️ Email not configured. Set RESEND_API_KEY in .env...
```

Then the API key is missing or invalid.

### Check 2: Send Test Email

1. Create an order in your application
2. Check Railway logs:

   ```bash
   railway logs | grep "email"
   ```

3. You should see:
   ```
   ✅ Order confirmation email sent successfully (ID: abc123...)
   ```

### Check 3: Resend Dashboard

1. Go to https://resend.com
2. Click **"Emails"** in sidebar
3. You should see your sent email with delivery status

## Troubleshooting

### Issue: "Email not configured" warning in logs

**Cause**: `RESEND_API_KEY` is not set or invalid

**Solution**:

1. Check Railway variables include `RESEND_API_KEY`
2. Verify the key is correct (starts with `re_`)
3. Try regenerating the key in Resend dashboard

### Issue: "Invalid API key" error

**Cause**: API key is wrong or expired

**Solution**:

1. Go to Resend dashboard → **API Keys**
2. Delete old key
3. Create new key
4. Update `RESEND_API_KEY` in Railway

### Issue: Emails going to spam

**Solutions**:

1. **Verify your domain** in Resend (adds SPF/DKIM records)
2. Use a professional `from` address (not @gmail.com)
3. Add unsubscribe link to email footer
4. Warm up your domain (start with low volume)

### Issue: Rate limit exceeded

**Cause**: Sent more than 100 emails/day (free tier)

**Solution**:

1. Upgrade to Pro plan ($20/month for 50k emails)
2. Or reduce email frequency

## Advanced: Custom Email Templates

Your current email templates use Handlebars (`.hbs` files) and will continue to work with Resend.

Template location:

```
apps/backend/src/mail/templates/order-confirmation.hbs
```

To create new templates, just create new `.hbs` files and call them from `mail.service.ts`.

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Status**: https://status.resend.com
- **Support**: support@resend.com

## Migration from Gmail SMTP

Your app has been fully migrated from Gmail SMTP to Resend.

**What changed**:

- ❌ Removed: `nodemailer`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`
- ✅ Added: `resend` package, `RESEND_API_KEY`

**What stayed the same**:

- ✅ Email templates (Handlebars)
- ✅ Email sending logic (same OrderEmailData interface)
- ✅ Error handling (emails fail gracefully)

**Benefits**:

- ✅ Works on Railway (no SMTP blocking)
- ✅ Faster delivery (HTTP API vs SMTP)
- ✅ Better tracking and analytics
- ✅ Easier setup (no 2FA, app passwords, etc.)

---

**Need help?** Check the main [PRODUCTION.md](./PRODUCTION.md) guide for more deployment information.
