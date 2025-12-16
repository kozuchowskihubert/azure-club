# Railway Deployment Guide dla ARCH1TECT API

## Szybki Setup (5-10 minut)

### Krok 1: Utwórz konto Railway
1. Idź na https://railway.app
2. Kliknij "Start a New Project"
3. Zaloguj się przez GitHub

### Krok 2: Deploy z GitHub
1. Kliknij "New Project"
2. Wybierz "Deploy from GitHub repo"
3. Wybierz `kozuchowskihubert/azure-club`
4. Railway automatycznie wykryje Python app i zacznie deployment

### Krok 3: Dodaj PostgreSQL Database
1. W Railway dashboard, kliknij "+ New"
2. Wybierz "Database" → "Add PostgreSQL"
3. Railway automatycznie utworzy bazę i ustawi `DATABASE_URL`

### Krok 4: Dodaj zmienne środowiskowe
Kliknij na swój service → Variables → dodaj:

```bash
# Email Configuration (Resend)
MAIL_SERVER=smtp.resend.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=resend
MAIL_PASSWORD=re_HbXMqMHv_FpFfbuUHr44J5kCpFUu9a4a8
MAIL_SENDER=arch1tect@haos.fm

# Railway automatycznie dodaje:
# DATABASE_URL (PostgreSQL connection)
# PORT (dla web service)
```

### Krok 5: Zrestartuj deployment
1. Kliknij "Deploy" → "Redeploy"
2. Poczekaj 2-3 minuty
3. Kliknij "Generate Domain" żeby dostać publiczny URL

### Krok 6: Przetestuj API
```bash
# Zamień YOUR_RAILWAY_URL na swój Railway domain
curl https://YOUR_RAILWAY_URL.railway.app/api/health
curl https://YOUR_RAILWAY_URL.railway.app/api/events
```

## Zmienne środowiskowe - pełna lista

### Wymagane (musisz dodać):
- `MAIL_SERVER=smtp.resend.com`
- `MAIL_PORT=587`
- `MAIL_USE_TLS=True`
- `MAIL_USERNAME=resend`
- `MAIL_PASSWORD=re_HbXMqMHv_FpFfbuUHr44J5kCpFUu9a4a8` (Resend API key)
- `MAIL_SENDER=arch1tect@haos.fm`

### Automatyczne (Railway dodaje):
- `DATABASE_URL` - PostgreSQL connection string (Railway postgres)
- `PORT` - Port dla web service (Railway auto-assign)

## Po deployment

### Update Frontend URLs
Zaktualizuj `API_URL` w następujących plikach:
- `index.html` (linia ~1200)
- `admin.html` (linia ~50)
- `test-booking.html` (linia ~200)

Zamień:
```javascript
const API_URL = 'https://azure-club.vercel.app/api';
```

Na:
```javascript
const API_URL = 'https://YOUR_RAILWAY_URL.railway.app/api';
```

### Redeploy Frontend na Vercel
```bash
git add index.html admin.html test-booking.html
git commit -m "🔧 Update API URL to Railway"
git push origin main
vercel --prod
```

## Monitoring & Logs

### Zobacz logi Railway:
```bash
# Zainstaluj Railway CLI
npm i -g @railway/cli

# Login
railway login

# Zobacz logi
railway logs
```

### Lub w Dashboard:
1. Idź do Railway dashboard
2. Kliknij na swój service
3. Zakładka "Deployments" → kliknij na aktywny deployment
4. Zobacz "Build Logs" i "Deploy Logs"

## Troubleshooting

### Problem: "Application failed to respond"
**Rozwiązanie:** Sprawdź czy PORT jest poprawnie użyty w `events_api_postgres.py`:
```python
port = int(os.environ.get('PORT', 5001))
app.run(host='0.0.0.0', port=port)
```

### Problem: "Database connection failed"
**Rozwiązanie:** Sprawdź czy PostgreSQL service jest dodany i `DATABASE_URL` istnieje w Variables.

### Problem: "Email not sending"
**Rozwiązanie:** 
1. Sprawdź czy wszystkie MAIL_* variables są dodane
2. Zweryfikuj Resend API key
3. Sprawdź logi: `railway logs | grep -i mail`

### Problem: "502 Bad Gateway"
**Rozwiązanie:** App może się crashować przy starcie. Zobacz logi:
```bash
railway logs
```

## Koszty

### Free Tier (Hobby Plan):
- **500 godzin/miesiąc** execution time
- **100 GB/miesiąc** bandwidth
- **5 GB** PostgreSQL storage
- **Wystarcza** dla małych/średnich projektów

### Developer Plan ($5/miesiąc):
- **100 godzin/miesiąc** dla każdego service
- **100 GB/miesiąc** bandwidth
- **Unlimited** services

### Dla ARCH1TECT:
- Szacowany koszt: **$0-2/miesiąc** (Free tier powinien wystarczyć)
- Jeśli przekroczysz limit: Railway poinformuje przed naliczeniem opłat

## Next Steps

1. ✅ Deploy API na Railway
2. ✅ Dodaj PostgreSQL database
3. ✅ Skonfiguruj zmienne środowiskowe
4. ✅ Wygeneruj public domain
5. ✅ Przetestuj endpoints
6. ✅ Zaktualizuj frontend URLs
7. ✅ Redeploy frontend na Vercel
8. ✅ Test end-to-end (booking + email)

## Pomocne linki

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Resend Dashboard: https://resend.com/emails
- Vercel Dashboard: https://vercel.com/dashboard

---

**Potrzebujesz pomocy?** Sprawdź logi w Railway dashboard lub uruchom `railway logs` w terminalu.
