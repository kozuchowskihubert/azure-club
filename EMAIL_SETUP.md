# 📧 Konfiguracja Email dla domeny HAOS

## Przegląd

System ARCH1TECT używa SMTP do wysyłania emaili powitalnych, potwierdzeń rezerwacji i zatwierdzenia bookingów. Ten przewodnik pokazuje jak skonfigurować email z własnej domeny HAOS.

## 🎯 Zalecane adresy email:
- **Główny (ZALECANY):** `arch1tect@haos.fm` - łączy artystę z radiem HAOS.fm
- **Alternatywne:** `booking@haos.fm`, `admin@haos.fm`
- **Backup:** `admin@haos.club`, `booking@haos.club`, `admin@arch1tect.pl`

## 🌐 Konfiguracja wielu domen w Resend

Możesz dodać wszystkie domeny HAOS w jednym koncie Resend:
- `haos.fm` - **główna domena** (radio + artysta)
- `haos.club` - domena klubu
- `arch1tect.pl` - domena artysty (backup)

Każda domena może mieć własne adresy: admin@, booking@, info@, noreply@

## Opcje Konfiguracji

### ⚡ Opcja 1: Resend (NAJLEPSZE - Darmowe 3000 emaili/miesiąc + 100/dzień)

**Najlepsze dla:** Nowoczesne API, świetna dokumentacja, łatwa integracja, React Email support

1. **Załóż konto:** https://resend.com/signup
2. **Dodaj i zweryfikuj domeny HAOS:**
   - Dashboard → Domains → Add Domain
   - Dodaj każdą domenę osobno (priorytet):
     1. `haos.fm` ⭐ **GŁÓWNA** - radio + artysta
     2. `haos.club` - klub/eventy
     3. `arch1tect.pl` - backup
   
   - Dla każdej domeny dodaj rekordy DNS:
     ```
     Type: TXT
     Name: @
     Value: resend._domainkey.<unique-value>
     
     Type: MX
     Priority: 10
     Name: @
     Value: feedback-smtp.resend.com
     ```
   - Czekaj na weryfikację (~5 min)

3. **Stwórz API Key:**
   - Dashboard → API Keys → Create API Key
   - Name: "ARCH1TECT Production"
   - Permissions: "Sending access"
   - Copy API key: `re_123abc...`

4. **Konfiguracja SMTP Resend:**
   ```
   MAIL_SERVER=smtp.resend.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=resend
   MAIL_PASSWORD=<twój-resend-api-key>
   ```

5. **Dodaj do Vercel Environment Variables:**
   ```bash
   vercel env add MAIL_SERVER production
   # Wartość: smtp.resend.com
   
   vercel env add MAIL_PORT production
   # Wartość: 587
   
   vercel env add MAIL_USE_TLS production
   # Wartość: True
   
   vercel env add MAIL_USERNAME production
   # Wartość: resend
   
   vercel env add MAIL_PASSWORD production
   # Wartość: <twój-resend-api-key>
   ```

**✅ Korzyści Resend:**
- 3,000 emaili/miesiąc za darmo (vs 100/dzień SendGrid)
- Limit 100 emaili/dzień (więcej niż wystarczy)
- Nowoczesny dashboard z analityką
- Built by Vercel team - świetna integracja
- React Email templates support
- Webhook support dla tracking
- Bardzo prosta konfiguracja

#### 📝 Przykład konfiguracji DNS dla haos.fm:

Po dodaniu domeny `haos.fm` w Resend Dashboard, zobaczysz unikalne rekordy DNS:

```
# SPF Record - autoryzacja serwera do wysyłki
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record - podpis cyfrowy emaili
Type: TXT  
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA... (unikalny klucz z Resend)

# DMARC Record - polityka autoryzacji
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:arch1tect@haos.fm

# MX Record - opcjonalny, do odbierania emaili
Type: MX
Priority: 10
Name: @
Value: feedback-smtp.resend.com
```

**Gdzie dodać rekordy DNS:**
- Jeśli domena w **Vercel**: Vercel Dashboard → Domains → haos.fm → DNS Records
- Jeśli domena w **Cloudflare**: Dashboard → DNS → Add Record
- Jeśli domena u **innego providera**: Panel domeny → DNS Management

**⏱️ Czas propagacji:** 5-60 minut (sprawdzaj status w Resend Dashboard)

#### 📧 Wybór adresu wysyłkowego:

Po weryfikacji domeny możesz używać dowolnego adresu w tej domenie:
- `arch1tect@haos.fm` ⭐ **ZALECANY** - łączy artystę z radiem
- `booking@haos.fm` - rezerwacje i potwierdzenia
- `admin@haos.fm` - oficjalne powiadomienia
- `events@haos.fm` - informacje o eventach
- `noreply@haos.fm` - automatyczne emaile

**Konfiguracja w Vercel:**
```bash
# Ustaw adres wysyłkowy (dla Resend to wartość MAIL_SENDER, nie MAIL_USERNAME)
vercel env add MAIL_SENDER production
# Wartość: arch1tect@haos.fm

# MAIL_USERNAME dla Resend jest zawsze "resend"
vercel env add MAIL_USERNAME production
# Wartość: resend
```

---

### 🎯 Opcja 2: SendGrid (Alternatywa - 100 emaili/dzień)

**Najlepsze dla:** Transakcyjnych emaili, darmowy tier, łatwa konfiguracja

1. **Załóż konto:** https://signup.sendgrid.com/
2. **Zweryfikuj email:** admin@arch1tect.pl
3. **Stwórz API Key:** Settings → API Keys → Create API Key
4. **Skonfiguruj DNS dla domeny:**
   - Idź do: Settings → Sender Authentication → Verify Single Sender
   - Dodaj rekordy DNS w panelu domeny:
     ```
     Type: CNAME
     Name: em9876.arch1tect.pl
     Value: u9876543.wl123.sendgrid.net
     
     Type: CNAME
     Name: s1._domainkey.arch1tect.pl
     Value: s1.domainkey.u9876543.wl123.sendgrid.net
     
     Type: CNAME
     Name: s2._domainkey.arch1tect.pl
     Value: s2.domainkey.u9876543.wl123.sendgrid.net
     ```

5. **Dodaj do Vercel Environment Variables:**
   ```bash
   vercel env add MAIL_SERVER production
   # Wartość: smtp.sendgrid.net
   
   vercel env add MAIL_PORT production
   # Wartość: 587
   
   vercel env add MAIL_USE_TLS production
   # Wartość: True
   
   vercel env add MAIL_USERNAME production
   # Wartość: apikey
   
   vercel env add MAIL_PASSWORD production
   # Wartość: <twój-sendgrid-api-key>
   ```

---

### 📮 Opcja 2: Mailgun (1000 emaili/miesiąc za darmo)

1. **Załóż konto:** https://signup.mailgun.com/
2. **Dodaj domenę:** arch1tect.pl
3. **Skonfiguruj DNS rekordy:**
   ```
   Type: TXT
   Name: arch1tect.pl
   Value: v=spf1 include:mailgun.org ~all
   
   Type: TXT
   Name: _dmarc.arch1tect.pl
   Value: v=DMARC1; p=none;
   
   Type: CNAME
   Name: email.arch1tect.pl
   Value: mailgun.org
   ```

4. **Credentials:**
   ```bash
   MAIL_SERVER=smtp.eu.mailgun.org
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=postmaster@arch1tect.pl
   MAIL_PASSWORD=<z-mailgun-dashboard>
   ```

---

### 💼 Opcja 3: Google Workspace (Profesjonalny, ~$6/miesiąc)

1. **Załóż konto:** https://workspace.google.com/
2. **Zweryfikuj domenę** arch1tect.pl
3. **Stwórz użytkownika:** admin@arch1tect.pl
4. **Włącz 2FA i stwórz App Password:**
   - Idź do: myaccount.google.com/security
   - 2-Step Verification → App Passwords
   - Wybierz "Mail" i "Other device"
   - Skopiuj 16-znakowe hasło

5. **Credentials:**
   ```bash
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=admin@arch1tect.pl
   MAIL_PASSWORD=<16-char-app-password>
   ```

---

### 🏠 Opcja 4: Email hosting od dostawcy domeny

Jeśli kupiłeś domenę arch1tect.pl u dostawcy (OVH, home.pl, nazwa.pl, itp.), często oferują darmowy email hosting.

**Typowa konfiguracja:**
```bash
MAIL_SERVER=mail.arch1tect.pl  # lub smtp.arch1tect.pl
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=admin@arch1tect.pl
MAIL_PASSWORD=<hasło-z-panelu-hostingu>
```

**Gdzie znaleźć ustawienia:**
- **OVH:** Panel klienta → Web Cloud → Email
- **home.pl:** Panel → E-mail → Konfiguracja
- **nazwa.pl:** Panel → E-mail → Parametry

---

## 🚀 Dodanie zmiennych do Vercel

Po wyborze opcji, dodaj zmienne środowiskowe do Vercel:

```bash
# Podstawowa konfiguracja
vercel env add MAIL_SERVER production
vercel env add MAIL_PORT production
vercel env add MAIL_USE_TLS production
vercel env add MAIL_USERNAME production
vercel env add MAIL_PASSWORD production

# Opcjonalne (dla SSL zamiast TLS)
vercel env add MAIL_USE_SSL production
```

## ✅ Testowanie konfiguracji

Po wdrożeniu, przetestuj wysyłkę emaila:

```bash
# Test przez API
curl -X POST https://azure-club.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "name": "Test User",
    "email": "your-test-email@gmail.com",
    "phone": "+48123456789",
    "event_date": "2025-12-25",
    "event_type": "club",
    "start_time": "22:00",
    "venue": "Club HAOS",
    "city": "Gdańsk",
    "guests": 2,
    "message": "Test booking"
  }'
```

Sprawdź:
1. Status code: `201 Created`
2. Email potwierdzający w skrzynce odbiorczej
3. Logi Vercel: https://vercel.com/hubertkozuchowski-3144s-projects/azure-club/logs

## 🔍 Troubleshooting

### Problem: "535 Authentication failed"
**Rozwiązanie:** Sprawdź username i password. Dla Gmail użyj App Password, nie zwykłego hasła.

### Problem: "Connection timeout"
**Rozwiązanie:** 
- Sprawdź czy MAIL_PORT jest poprawny (587 dla TLS, 465 dla SSL)
- Niektóre providery blokują port 25

### Problem: Email trafia do SPAM
**Rozwiązanie:**
- Skonfiguruj SPF record: `v=spf1 include:_spf.mailgun.org ~all`
- Dodaj DKIM records (dostępne w dashboardzie SendGrid/Mailgun)
- Dodaj DMARC record: `v=DMARC1; p=none; rua=mailto:admin@arch1tect.pl`

### Problem: "Sender address rejected"
**Rozwiązanie:** Zweryfikuj domenę w dashboardzie email providera (SendGrid/Mailgun).

## 📊 Monitoring

Sprawdzaj logi wysyłki emaili:
- **SendGrid:** Dashboard → Activity
- **Mailgun:** Dashboard → Logs
- **Vercel:** Project → Logs (filtruj po "MAIL")

## 🔐 Bezpieczeństwo

✅ **Nigdy** nie commituj haseł do Git
✅ Używaj App Passwords zamiast głównych haseł
✅ Włącz 2FA na kontach email
✅ Regularnie rotuj API keys
✅ Używaj zmiennych środowiskowych w Vercel
✅ Oznacz zmienne jako "Sensitive" w Vercel

---

## 🎯 Quick Start (Najszybsza opcja - Resend)

```bash
# 1. Załóż konto Resend
open https://resend.com/signup

# 2. Dodaj domenę haos.fm i zweryfikuj DNS
# Dashboard → Domains → Add Domain → Follow DNS setup (TXT + MX records)

# 3. Stwórz API Key (Dashboard → API Keys → Create)
# Skopiuj klucz zaczynający się od "re_"

# 4. Dodaj do Vercel Environment Variables
vercel env add MAIL_SERVER production   # smtp.resend.com
vercel env add MAIL_PORT production     # 587
vercel env add MAIL_USE_TLS production  # True
vercel env add MAIL_USERNAME production # resend
vercel env add MAIL_PASSWORD production # <twój-resend-api-key>
vercel env add MAIL_SENDER production   # arch1tect@haos.fm

# 5. Redeploy
vercel --prod

# 6. Test wysyłki emaila
curl -X POST https://azure-club.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "event_id": 1,
    "name": "Test Booking",
    "email": "your-email@example.com",
    "phone": "+48123456789",
    "event_date": "2025-12-25",
    "event_type": "club",
    "start_time": "22:00",
    "venue": "Club HAOS",
    "city": "Gdańsk",
    "guests": 2
  }'

# 7. Sprawdź status w Resend Dashboard → Emails
```

✨ Gotowe! System będzie wysyłać emaile z `arch1tect@haos.fm` przez Resend.

**Sprawdź email:**
- Potwierdzenie powinno przyjść na adres podany w `email` field
- W Resend Dashboard zobaczysz status: Sent / Delivered / Bounced
- Free tier: 3,000 emaili/miesiąc, 100/dzień
