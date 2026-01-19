# Mailgun Email Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Mailgun Account

1. Visit: **https://signup.mailgun.com/new/signup**
2. Fill in your details (email, password, company name)
3. Click **"Start sending"**
4. Verify your email address (check inbox for verification link)

### Step 2: Get Your API Key and Domain

1. Once logged in, go to **"Sending"** → **"Domain settings"** in the left sidebar
2. You'll see a **sandbox domain** already created (e.g., `sandbox-abc123xyz.mailgun.org`)
3. Click on your sandbox domain
4. **Copy these two values**:
   - **API Key**: Starts with `key-` (e.g., `key-abc123xyz456`)
   - **Domain Name**: Your sandbox domain (e.g., `sandbox-abc123xyz.mailgun.org`)

### Step 3: Authorize Test Recipients (Important for Sandbox)

**Note**: Sandbox domains can only send to authorized email addresses. You must authorize each recipient.

1. In your sandbox domain settings, scroll to **"Authorized Recipients"**
2. Click **"+ Add Recipient"**
3. Enter the email address you want to test with (e.g., your own email or customer email)
4. Click **"Add"**
5. Check the recipient's inbox for a verification email from Mailgun
6. Click **"I Agree"** in the verification email
7. Repeat for each email address you want to test

### Step 4: Add to Railway

#### Option A: Through Railway Dashboard

1. Go to your Railway project
2. Select your backend service
3. Click **"Variables"** tab
4. Click **"+ New Variable"** for each:
   - **Name**: `MAILGUN_API_KEY`
   - **Value**: `key-abc123xyz456` (paste your API key)

   - **Name**: `MAILGUN_DOMAIN`
   - **Value**: `sandbox-abc123xyz.mailgun.org` (paste your sandbox domain)

   - **Name**: `MAIL_FROM_NAME`
   - **Value**: `Gráfica System` (or your app name)

   - **Name**: `MAIL_FROM_ADDRESS`
   - **Value**: `noreply@sandbox-abc123xyz.mailgun.org` (use your sandbox domain)

5. Click **"Add"** for each variable
6. Railway will automatically redeploy

#### Option B: Through Railway CLI

```bash
railway variables set MAILGUN_API_KEY=key-your-api-key-here
railway variables set MAILGUN_DOMAIN=sandbox-xxx.mailgun.org
railway variables set MAIL_FROM_NAME="Gráfica System"
railway variables set MAIL_FROM_ADDRESS=noreply@sandbox-xxx.mailgun.org
```

### Step 5: Test

1. **Deploy and check logs**:

   ```bash
   railway logs
   # Look for: ✅ Mailgun email service configured successfully
   ```

2. **Create a test order** in your application with an authorized email

3. **Check email was sent**:
   - Check Railway logs for: `✅ Order confirmation email sent successfully`
   - OR check Mailgun dashboard → **"Sending"** → **"Logs"** to see sent emails
   - Check the recipient's inbox

## Free Tier Limits

Mailgun free tier includes:

- ✅ **5,000 emails per month** (for first 3 months)
- ✅ Email validation
- ✅ Full analytics and tracking
- ✅ No credit card required for first month

After 3 months, credit card required but free tier continues.

## Local Development

For local testing, add to your `.env` file:

```bash
# Get these from https://app.mailgun.com → Sending → Domain settings
MAILGUN_API_KEY="key-your-api-key-here"
MAILGUN_DOMAIN="sandbox-xxx.mailgun.org"
MAIL_FROM_NAME="Gráfica System"
MAIL_FROM_ADDRESS="noreply@sandbox-xxx.mailgun.org"
```

Then run:

```bash
npm run start:dev
```

## Upgrading from Sandbox to Verified Domain

To send emails to **any recipient** (not just authorized ones), you need to verify your own domain.

### Step 1: Add Your Domain

1. Go to **"Sending"** → **"Domains"**
2. Click **"Add New Domain"**
3. Enter your domain (e.g., `graficasystem.com`)
4. Choose region (US or EU)
5. Click **"Add Domain"**

### Step 2: Verify Domain with DNS Records

Mailgun will provide DNS records to add to your domain provider (Namecheap, GoDaddy, etc.):

**Required DNS Records**:

- **TXT** record for domain verification
- **MX** records for receiving emails (optional)
- **CNAME** records for tracking

**Example DNS Records**:

```
Type: TXT
Name: @
Value: v=spf1 include:mailgun.org ~all

Type: TXT
Name: smtp._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4...

Type: CNAME
Name: email.graficasystem.com
Value: mailgun.org

Type: MX
Name: @
Priority: 10
Value: mxa.mailgun.org
```

### Step 3: Wait for Verification

- DNS propagation can take **5-48 hours**
- Check verification status in Mailgun dashboard
- Status will change from "Unverified" → "Active"

### Step 4: Update Environment Variables

Once verified, update your variables:

```bash
MAILGUN_DOMAIN="graficasystem.com"
MAIL_FROM_ADDRESS="noreply@graficasystem.com"
```

Now you can send to **any email address** without authorization!

## Pricing (When You Scale)

| Plan       | Price     | Emails                 |
| ---------- | --------- | ---------------------- |
| Foundation | Free      | 5,000/month            |
| Foundation | $35/month | 50,000/month           |
| Growth     | $80/month | 100,000/month          |
| Scale      | $90/month | 100,000/month + extras |

Pay-as-you-go: $0.80 per 1,000 emails after limit.

## Verify It's Working

### Check 1: Application Startup

When your app starts, you should see in logs:

```
✅ Mailgun email service configured successfully
```

If you see this instead:

```
⚠️ Email not configured. Set MAILGUN_API_KEY in .env...
```

Then the API key or domain is missing/invalid.

### Check 2: Send Test Email

1. Create an order in your application (use an authorized email if using sandbox)
2. Check Railway logs:

   ```bash
   railway logs | grep "email"
   ```

3. You should see:
   ```
   ✅ Order confirmation email sent successfully (ID: <20230101123456.abc@sandbox-xxx.mailgun.org>)
   ```

### Check 3: Mailgun Dashboard

1. Go to https://app.mailgun.com
2. Click **"Sending"** → **"Logs"** in sidebar
3. You should see your sent email with delivery status

## Troubleshooting

### Issue: "Email not configured" warning in logs

**Cause**: `MAILGUN_API_KEY` or `MAILGUN_DOMAIN` is not set or invalid

**Solution**:

1. Check Railway/local variables include both `MAILGUN_API_KEY` and `MAILGUN_DOMAIN`
2. Verify the API key is correct (starts with `key-`)
3. Verify the domain is correct (e.g., `sandbox-xxx.mailgun.org`)

### Issue: "Forbidden: sandbox domain only allows authorized recipients"

**Cause**: Trying to send to an email that is not authorized in sandbox

**Solution**:

1. Go to Mailgun dashboard → Your sandbox domain
2. Scroll to **"Authorized Recipients"**
3. Click **"+ Add Recipient"**
4. Enter the recipient email
5. Have them click the verification link sent to their inbox

**OR**: Verify your own domain (see "Upgrading from Sandbox" section above)

### Issue: "Invalid API key" error

**Cause**: API key is wrong or from wrong region

**Solution**:

1. Go to Mailgun dashboard → **"Sending"** → **"Domain settings"**
2. Click on your domain
3. Check the API key shown there
4. Update `MAILGUN_API_KEY` in Railway/local .env
5. **Important**: If you're in EU, use `https://api.eu.mailgun.net` in mail.service.ts

### Issue: Emails going to spam

**Solutions**:

1. **Verify your domain** (don't use sandbox in production)
2. Add **SPF** and **DKIM** records (Mailgun provides these)
3. Add **DMARC** policy:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com
   ```
4. Warm up your domain (start with low volume, increase gradually)
5. Avoid spam trigger words in subject/body
6. Include unsubscribe link

### Issue: "Connection timeout" or "Network error"

**Cause**: Firewall blocking outbound HTTP requests (rare on Railway)

**Solution**:

1. Verify internet connectivity
2. Check if Railway has any service issues: https://status.railway.app
3. Try switching region (US → EU or vice versa) in mail.service.ts:
   ```typescript
   url: 'https://api.eu.mailgun.net'; // For EU region
   ```

## Advanced: Custom Email Templates

Your current email templates use Handlebars (`.hbs` files) and will continue to work with Mailgun.

Template location:

```
apps/backend/src/mail/templates/order-confirmation.hbs
```

To create new templates, just create new `.hbs` files and call them from `mail.service.ts`.

## Support

- **Mailgun Docs**: https://documentation.mailgun.com
- **Mailgun Status**: https://status.mailgun.com
- **Support**: Via dashboard or support@mailgun.com

## Migration from Gmail SMTP

Your app has been fully migrated from Gmail SMTP to Mailgun.

**What changed**:

- ❌ Removed: `nodemailer`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`
- ✅ Added: `mailgun.js`, `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`

**What stayed the same**:

- ✅ Email templates (Handlebars)
- ✅ Email sending logic (same OrderEmailData interface)
- ✅ Error handling (emails fail gracefully)

**Benefits**:

- ✅ Works on Railway (no SMTP blocking)
- ✅ Faster delivery (HTTP API vs SMTP)
- ✅ Better tracking and analytics
- ✅ 5,000 emails/month free tier (vs 100/day with Resend)
- ✅ No domain verification required for testing (sandbox)

---

**Need help?** Check the main [PRODUCTION.md](./PRODUCTION.md) guide for more deployment information.
