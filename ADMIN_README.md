# 🎧 ARCH1TECT - Panel Administracyjny & API

## 📋 Przegląd

Kompletny system zarządzania eventami i rezerwacjami dla ARCH1TECT z:
- 🎛️ Panel administracyjny (admin.html)
- 🚀 Flask REST API (backend/app.py)
- 📧 Resend SMTP email notifications z kalendarzem
- �️ Neon PostgreSQL database (cloud)
- 📅 Integracja z Google Calendar, Outlook, Office 365
- 🎉 **Wydarzenia z życia (2002-2022)** już w bazie!

## 🚀 Uruchomienie Lokalne

### 1. Instalacja zależności

```bash
cd azure-club
python3 -m venv venv
source venv/bin/activate
pip install Flask==3.0.0 Flask-CORS==4.0.0 Flask-Mail==0.9.1 Flask-SQLAlchemy==3.1.1 python-dotenv==1.0.0 Jinja2==3.1.6 'psycopg[binary]' SQLAlchemy==2.0.23 gunicorn==21.2.0
```

### 2. Konfiguracja Backend

Utwórz `backend/.env`:

```env
# Neon PostgreSQL Database
DATABASE_URL=postgresql://neondb_owner:npg_CKhpaDNlnE51@ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:npg_CKhpaDNlnE51@ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech/neondb?sslmode=require

# Resend SMTP Email
MAIL_SERVER=smtp.resend.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USE_SSL=False
MAIL_USERNAME=resend
MAIL_PASSWORD=re_HbXMqMHv_FpFfbuUHr44J5kCpFUu9a4a8
MAIL_SENDER=arch1tect@haos.fm
MAIL_FROM=arch1tect@haos.fm

# Server
PORT=5001
FLASK_ENV=development
```

### 3. Uruchom Backend API

```bash
# Z unbuffered output dla debug logging
source venv/bin/activate
python -u backend/app.py
```

Backend będzie działać na: `http://localhost:5001`

### 4. Otwórz Panel Admina

```bash
open admin.html
```

Panel łączy się automatycznie z `http://localhost:5001/api`

**Brak logowania** - panel otwarty dla developmentu lokalnego

## 🎉 Wydarzenia w Bazie Danych

### Aktualny Stan (16 grudnia 2025)

**5 wydarzeń z życia (2002-2022):**

| Rok | Nazwa | Typ | Miasto | Opis |
|-----|-------|-----|--------|------|
| 2022 | **Archidesignstudio** | Praca | Gdańsk | Rozpoczęcie nowej pracy w firmie Archidesignstudio |
| 2014 | **RTIA Events** | Praca | Gdańsk | Rozpoczęcie nowej pracy w firmie RTIA events |
| 2013 | **Pumpingland - Rozpoczęcie Pracy** | Praca | Gdańsk | Rozpoczęcie nowej pracy w firmie Pumpingland |
| 2013 | **Narodziny PUMPINGLAND** | Impreza | Gdańsk | Narodziny legendarnego projektu PUMPINGLAND 🎧 |
| 2002 | **Clubbasse** | Praca | Gdańsk | Rozpoczęcie pracy w Clubbasse - początek kariery |

**Zarządzanie skryptami:**
```bash
# Dodaj wydarzenia
python backend/add_life_events.py

# Usuń wybrane wydarzenia
python backend/remove_events.py

# Zaktualizuj adresy
python backend/update_venues.py
```

### Testowe Rezerwacje (5 bookingów):
- 3x arturnonas@gmail.com (z email confirmation + kalendarz)
- 2x hubertkozuchowski@gmail.com
- Status: **pending** - oczekują na zatwierdzenie w admin panelu

## 📡 API Endpoints

### Events

```
GET    /api/events              - Lista wszystkich eventów
GET    /api/events/:id          - Szczegóły eventu
POST   /api/events              - Dodaj nowy event
PUT    /api/events/:id          - Aktualizuj event
DELETE /api/events/:id          - Usuń event
```

### Bookings

```
GET    /api/bookings            - Lista wszystkich rezerwacji
POST   /api/bookings            - Nowa rezerwacja (+ wysyła email)
POST   /api/bookings/:id/approve - Zatwierdź rezerwację (+ wysyła email)
POST   /api/bookings/:id/reject  - Odrzuć rezerwację
```

### Health Check

```
GET    /api/health              - Status API
```

## 📧 Email Templates + Kalendarz

System automatycznie wysyła profesjonalne emaile HTML przez **Resend SMTP** (arch1tect@haos.fm):

### 1. Potwierdzenie rezerwacji (przy submit formularza)
- ✅ Wysyłane automatycznie gdy ktoś wypełni formularz
- 📅 **Linki do kalendarza**: Google Calendar, Outlook, Office 365
- 🎨 HAOS branding (gradient pink/cyan, neon colors)
- 📧 Sender: ARCH1TECT | HAOS.fm
- 🔗 Calendar integration buttons w emailu

**Template zawiera:**
- Event title: "ARCH1TECT @ [Venue]"
- Data, godzina, miejsce
- Typ eventu, czas trwania
- 3 przyciski: Google Calendar, Outlook, Office 365
- Instrukcja dla iPhone/Mac (Safari → Dodaj do Kalendarza)

### 2. Zatwierdzenie rezerwacji (z panelu admina)
- Wysyłane gdy admin kliknie ✅ "Zatwierdź"
- Finalny email potwierdzający

### Email Debug Logging
Backend loguje każdy krok wysyłania emaila:
```
🚀 [BOOKING] Booking created with ID: 5
🔍 [EMAIL] Starting send_booking_confirmation...
✅ [EMAIL] Booking found: Name <email>
📅 [EMAIL] Generating calendar URLs...
✅ [EMAIL] Calendar URLs generated
📧 [EMAIL] Mail config verified
✅ [EMAIL] Email sent successfully!
```

## 🎛️ Panel Administracyjny - Funkcje

### Dashboard
- 📊 Statystyki: wszystkie eventy, nadchodzące, rezerwacje, oczekujące
- 📅 Zarządzanie eventami: CRUD operations
- 📝 Zarządzanie rezerwacjami: approve/reject

### Dodawanie/Edycja Eventu
Pola:
- Nazwa eventu
- Data i godzina
- Miejsce (venue + miasto)
- Typ eventu (club/festival/private/other)
- Opis
- Artyści (lista oddzielona przecinkami)
- Cena i pojemność
- URL zdjęcia
- Status (upcoming/sold_out/cancelled/completed)

### Zarządzanie Rezerwacjami
- Lista wszystkich rezerwacji
- Filtrowanie po statusie
- Akcje: zatwierdź (wysyła email) / odrzuć
- Pełne dane kontaktowe klienta

## �️ Baza Danych - Neon PostgreSQL

### Architektura
- **Provider**: Neon (serverless PostgreSQL)
- **Connection**: Pooler @ ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech
- **Database**: neondb
- **ORM**: SQLAlchemy 2.0.23
- **Driver**: psycopg3 (binary)

### Modele

**Event Model:**
```python
- id: Integer (Primary Key)
- name: String(200)
- date: Date
- time: String(10)
- venue: String(200)
- city: String(100)
- type: String(50) - club/festival/private/other/praca/impreza
- description: Text
- artists: String(500)
- price: Float (nullable)
- capacity: Integer (nullable)
- image_url: String(500)
- status: String(50) - upcoming/sold_out/cancelled/completed
- created_at, updated_at: DateTime
```

**Booking Model:**
```python
- id: Integer (Primary Key)
- event_id: Integer (Foreign Key, nullable)
- name, email, phone: String
- event_date: String(50)
- event_type, start_time, venue, city: String
- duration: Integer (godziny)
- guests: Integer
- message: Text
- status: String(50) - pending/approved/rejected
- calendar_event_sent: Boolean
- calendar_platforms: String(200)
- event_title, event_location: String
- created_at: DateTime
```

## 🔐 Bezpieczeństwo

### Obecnie zaimplementowane:
- **Environment variables** (.env) dla secrets
- **CORS** configured (Flask-CORS)
- **PostgreSQL** connection pooling
- **SSL/TLS** dla Neon database i SMTP

### TODO dla produkcji:
- [ ] Admin authentication (basic auth lub JWT)
- [ ] Rate limiting na API endpoints
- [ ] CSRF protection
- [ ] Input validation & sanitization
- [ ] API key authorization

## 🚂 Deployment na Railway (Backend)

### 1. Przygotowanie

Backend już jest w dedykowanym folderze `/backend`:
- `app.py` - Flask API
- `requirements.txt` - dependencies
- `Procfile` - gunicorn config
- `runtime.txt` - Python 3.11

### 2. Deployment Steps

1. **Wejdź na Railway**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Wybierz**: kozuchowskihubert/azure-club
4. **Settings → Root Directory**: `backend` ⚠️ WAŻNE!
5. **Add Environment Variables:**

```env
DATABASE_URL=postgresql://neondb_owner:npg_CKhpaDNlnE51@ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech/neondb?sslmode=require
POSTGRES_URL=postgresql://neondb_owner:npg_CKhpaDNlnE51@ep-quiet-heart-a94ke83k-pooler.gwc.azure.neon.tech/neondb?sslmode=require
MAIL_SERVER=smtp.resend.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=resend
MAIL_PASSWORD=re_HbXMqMHv_FpFfbuUHr44J5kCpFUu9a4a8
MAIL_SENDER=arch1tect@haos.fm
PORT=5001
```

6. **Generate Domain** - dostaniesz URL typu: `azure-club-production.up.railway.app`
7. **Deploy!**

### 3. Frontend na Vercel

Frontend już jest zdeployowany: https://azure-club.vercel.app

**Po Railway deployment - zaktualizuj API_URL:**

```javascript
// js/config.js, index.html, admin.html, test-booking.html
const API_URL = 'https://azure-club-production.up.railway.app/api';
```

Commit & push → Vercel auto-deploy

## 🌐 Deployment Status

### Obecny Stan:
- ✅ **Frontend**: https://azure-club.vercel.app (Vercel)
- ⏸️ **Backend**: localhost:5001 (do deploy na Railway)
- ✅ **Database**: Neon PostgreSQL (cloud)
- ✅ **Email**: Resend SMTP (cloud)

## 📝 Przykładowe użycie API

### Dodaj nowy event (cURL):

```bash
curl -X POST https://azure-club.vercel.app/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Techno Night",
    "date": "2025-03-15",
    "time": "22:00",
    "venue": "Club Underground",
    "city": "Gdańsk",
    "type": "club",
    "description": "Dark techno night",
    "artists": "ARCH1TECT, DJ X",
    "price": 50,
    "capacity": 200,
    "status": "upcoming"
  }'
```

### Nowa rezerwacja (JavaScript):

```javascript
const booking = {
  name: "Jan Kowalski",
  email: "jan@example.com",
  phone: "+48 123 456 789",
  event_date: "2025-03-15",
  event_type: "club",
  message: "Chciałbym zarezerwować..."
};

fetch('https://azure-club.vercel.app/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(booking)
})
.then(res => res.json())
.then(data => console.log('Booking created:', data));
```

## 🎨 Customizacja Email Templates

Edytuj template w `api/events_api.py`:

```python
BOOKING_CONFIRMATION_TEMPLATE = '''
<!-- Twój HTML template tutaj -->
'''
```

Variables dostępne w template:
- `{{ name }}` - imię klienta
- `{{ event_name }}` - nazwa eventu
- `{{ event_date }}` - data
- `{{ venue }}` - miejsce
- `{{ city }}` - miasto
- `{{ start_time }}` - godzina
- `{{ duration }}` - czas trwania
- `{{ event_type }}` - typ eventu
- `{{ message }}` - wiadomość od klienta

## 📞 Support

W razie problemów:
- Email: booking@arch1tect.pl
- Phone: +48 503 691 808

## 🎉 Features

✅ **Zaimplementowane:**
- Panel administracyjny z logowaniem
- CRUD dla eventów
- Lista i zarządzanie rezerwacjami
- SMTP email notifications
- Profesjonalne HTML email templates
- API REST endpoints
- SQLite database
- Integracja z formularzem na stronie

⏳ **TODO:**
- [ ] Statystyki w czasie rzeczywistym
- [ ] Export rezerwacji do CSV
- [ ] Calendar view w panelu admina
- [ ] Push notifications
- [ ] Multi-admin support
- [ ] Audit log

---

Made with 🎧 by ARCH1TECT
