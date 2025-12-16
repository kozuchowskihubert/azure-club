# 🔧 Vercel Environment Variables Setup

## Required for API to Work

Go to: **https://vercel.com/dashboard** → Select **azure-club** project → **Settings** → **Environment Variables**

---

## 1. Database (Neon PostgreSQL) - REQUIRED

```bash
# Variable Name: DATABASE_URL
# Value: (from Neon dashboard)
DATABASE_URL=postgresql://neondb_owner:npg_xxxxx@ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech/neondb?sslmode=require
```

**Or alternatively:**

```bash
# Variable Name: POSTGRES_URL
# Value: (same as above)
POSTGRES_URL=postgresql://neondb_owner:npg_xxxxx@ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech/neondb?sslmode=require
```

---

## 2. Email (Resend SMTP) - REQUIRED

```bash
MAIL_SERVER=smtp.resend.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
MAIL_USERNAME=resend
MAIL_PASSWORD=re_xxxxxxxxxxxxxxxxxxxxx
MAIL_SENDER=arch1tect@haos.fm
MAIL_FROM=arch1tect@haos.fm
```

---

## 3. SMS (Twilio) - OPTIONAL

```bash
# Get from: https://console.twilio.com/
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+48xxxxxxxxx
```

**Note:** If you don't add these, SMS will be disabled (email still works!)

---

## 4. General Settings - OPTIONAL

```bash
FLASK_ENV=production
```

---

## Quick Copy-Paste Format

For Vercel dashboard (one per line):

```
DATABASE_URL=postgresql://neondb_owner:npg_xxxxx...
MAIL_SERVER=smtp.resend.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=resend
MAIL_PASSWORD=re_xxxxxxxxxxxxxxxxxxxxx
MAIL_SENDER=arch1tect@haos.fm
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+48xxxxxxxxx
```

---

## Steps to Add Variables

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Project**
   - Click on `azure-club`

3. **Go to Settings**
   - Click **Settings** tab
   - Click **Environment Variables** on left sidebar

4. **Add Each Variable**
   - Click **Add New**
   - Enter **Name** (e.g., `DATABASE_URL`)
   - Enter **Value** (paste your connection string)
   - Select environments: **Production**, **Preview**, **Development** (all 3)
   - Click **Save**

5. **Repeat for All Variables**
   - Add all required variables (Database + Email)
   - Add optional SMS variables if you want SMS notifications

6. **Redeploy**
   - After adding variables, Vercel will auto-redeploy
   - Or manually trigger: **Deployments** → **...** → **Redeploy**

---

## Where to Get Values

### Database (Neon)
- Dashboard: https://console.neon.tech/
- Project: **azure-club**
- Copy connection string from dashboard

### Email (Resend)
- Dashboard: https://resend.com/
- API Keys: Get your API key
- Domain: arch1tect@haos.fm (verified)

### SMS (Twilio) - Optional
- Dashboard: https://console.twilio.com/
- Account SID: From dashboard
- Auth Token: From dashboard
- Phone Number: Purchase in console

---

## Verify Setup

After adding variables and deployment completes:

1. **Test Health Endpoint**
   ```bash
   curl https://azure-club.vercel.app/api/health
   ```
   Expected: `{"status":"ok","message":"ARCH1TECT API is running","database":"PostgreSQL"}`

2. **Test Events Endpoint**
   ```bash
   curl https://azure-club.vercel.app/api/events
   ```
   Expected: JSON array of events

3. **Test Booking (Full Flow)**
   - Go to: https://azure-club.vercel.app/test-booking.html
   - Fill form with your email
   - Submit
   - Check email for confirmation with calendar links
   - Check SMS if Twilio configured

---

## Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is correct
- Verify connection string has `?sslmode=require` at end
- Test connection string in backend/.env locally first

### "Email not sent"
- Check `MAIL_PASSWORD` (Resend API key) is correct
- Verify `MAIL_SENDER` domain is verified in Resend
- Check Vercel deployment logs for errors

### "SMS not working"
- This is optional! Check if you added Twilio variables
- Verify phone number format: +48xxxxxxxxx
- Check Twilio account balance
- System works fine without SMS (email only)

---

## Current Status

✅ Code deployed to GitHub  
✅ Vercel will auto-deploy on push  
⏳ **NEXT:** Add environment variables in Vercel dashboard  
⏳ **THEN:** Test API endpoints  

---

## Benefits of Serverless API

✅ **No sleeping** - Always available (unlike Railway)  
✅ **Auto-scales** - Handles traffic automatically  
✅ **Free tier** - Generous limits on Vercel  
✅ **Global CDN** - Fast worldwide  
✅ **Zero maintenance** - No server management  
✅ **Same database** - Still using Neon PostgreSQL  
✅ **Same features** - Email, SMS, Calendar integration  

---

**Last Updated:** 2025-01-16  
**Status:** Ready for environment variable configuration
