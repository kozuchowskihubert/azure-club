# 🚀 Deployment Guide - Standalone Architecture

## Architektura projektu

```
azure-club/
├── backend/              # Flask REST API (Railway)
│   ├── app.py           # Main Flask application
│   ├── requirements.txt # Python dependencies
│   ├── Procfile        # Railway start command
│   ├── runtime.txt     # Python version
│   └── README.md       # Backend documentation
│
├── index.html          # Frontend homepage (Vercel)
├── admin.html          # Admin panel (Vercel)
├── test-booking.html   # Test form (Vercel)
├── js/                 # Frontend JavaScript
│   ├── config.js       # API URL configuration
│   └── calendar-utils.js
└── css/                # Frontend styles
```

## 🎯 Deployment Strategy

**Backend (Flask API)** → **Railway.app**
- Pełne wsparcie Flask/WSGI
- PostgreSQL database included
- Environment variables
- Automatic deployments

**Frontend (HTML/CSS/JS)** → **Vercel**
- Static site hosting
- Fast CDN
- Automatic deployments
- Free tier

---

## 📦 Part 1: Backend Deployment (Railway)

### Krok 1: Push do GitHub
```bash
cd /Users/haos/azure-club
git add backend/
git commit -m "🚀 Add standalone backend structure"
git push origin main
```

### Krok 2: Utwórz Railway Project
1. Idź na https://railway.app
2. Login with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Wybierz: `kozuchowskihubert/azure-club`
5. **WAŻNE:** W settings → **Root Directory** ustaw: `backend`

### Krok 3: Dodaj PostgreSQL
1. W Railway dashboard, kliknij **+ New**
2. Wybierz **Database** → **Add PostgreSQL**
3. Railway automatycznie ustawi `DATABASE_URL`

### Krok 4: Zmienne środowiskowe
Kliknij service → **Variables** → dodaj każdą z osobna:

```bash
MAIL_SERVER=smtp.resend.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=resend
MAIL_PASSWORD=re_HbXMqMHv_FpFfbuUHr44J5kCpFUu9a4a8
MAIL_SENDER=arch1tect@haos.fm
```

### Krok 5: Deploy & Get URL
1. Railway automatycznie deployuje (2-3 min)
2. **Settings** → **Networking** → **Generate Domain**
3. **SKOPIUJ URL** i wyślij mi go!

✅ **Backend gotowy!**

---

Napisz mi Railway URL a zaktualizuję frontend! 🚀
