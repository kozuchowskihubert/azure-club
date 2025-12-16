# GitHub Pages Deployment Guide

## ✅ Your Production Setup

**Frontend**: GitHub Pages (Free, Always On)
- URL: https://kozuchowskihubert.github.io/azure-club/
- Hosting: GitHub (unlimited bandwidth)
- Deploy: Automatic on every push to main

**Backend**: Railway
- API URL: https://azure-club-production.up.railway.app/api
- Database: Neon PostgreSQL
- Email: Resend SMTP
- Features: Email confirmations, Calendar exports, SMS notifications (ready)

## 🚀 How to Enable GitHub Pages

1. Go to: https://github.com/kozuchowskihubert/azure-club/settings/pages
2. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**
4. Wait 1-2 minutes for deployment
5. Your site will be live at: https://kozuchowskihubert.github.io/azure-club/

## 🔄 How to Update

Every time you push to the `main` branch, GitHub Pages automatically rebuilds and deploys:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait ~1 minute, then refresh your site!

## 🧪 Testing

Once GitHub Pages is enabled, test:

1. **Frontend**: https://kozuchowskihubert.github.io/azure-club/
2. **API Health**: https://azure-club-production.up.railway.app/api/health
3. **Events**: https://azure-club-production.up.railway.app/api/events
4. **Booking Form**: https://kozuchowskihubert.github.io/azure-club/test-booking.html
5. **Admin Panel**: https://kozuchowskihubert.github.io/azure-club/admin.html

## 📝 Configuration

All settings are in `js/config.js`:
- Frontend URL points to GitHub Pages
- Backend API points to Railway
- Everything else stays the same!

## ⚠️ Note About Railway

Railway free tier sleeps after inactivity. If the API doesn't respond:
1. Visit: https://azure-club-production.up.railway.app/api/health
2. Wait 30 seconds for it to wake up
3. Refresh your page

## 🎉 Benefits

✅ **GitHub Pages**: Free, fast CDN, no rate limits
✅ **Railway Backend**: PostgreSQL database, email, calendar
✅ **Separation**: Frontend and backend hosted separately
✅ **Scalability**: Can switch backend providers easily
✅ **Reliability**: GitHub Pages has 99.9% uptime

## 🔗 Quick Links

- GitHub Repo: https://github.com/kozuchowskihubert/azure-club
- GitHub Pages Settings: https://github.com/kozuchowskihubert/azure-club/settings/pages
- Railway Dashboard: https://railway.app/project/your-project
- Neon Database: https://console.neon.tech/
