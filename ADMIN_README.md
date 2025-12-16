# 🎧 ARCH1TECT - Panel Administracyjny & API

## 📋 Przegląd

Kompletny system zarządzania eventami i rezerwacjami dla ARCH1TECT z:
- 🎛️ Panel administracyjny (admin.html)
- 🚀 Flask REST API (events_api.py)
- 📧 SMTP email notifications z profesjonalnymi templateami
- 📊 SQLite database dla eventów i rezerwacji
- 🔐 Bezpieczne logowanie do panelu

## 🚀 Uruchomienie Lokalne

### 1. Instalacja zależności

```bash
cd azure-club
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Konfiguracja SMTP

Skopiuj `.env.example` do `.env` i uzupełnij dane SMTP:

```bash
cp .env.example .env
```

Edytuj `.env`:

```env
# Gmail SMTP (zalecane)
MAIL_USERNAME=twoj-email@gmail.com
MAIL_PASSWORD=twoje-haslo-aplikacji

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=HAOS2025!
```

#### Jak uzyskać hasło aplikacji Gmail:

1. Wejdź na https://myaccount.google.com/security
2. Włącz "2-Step Verification" (weryfikacja dwuetapowa)
3. Wejdź w "App passwords" (hasła aplikacji)
4. Wybierz "Other" i nazwij "ARCH1TECT"
5. Skopiuj wygenerowane hasło do `.env`

### 3. Uruchom API

```bash
cd api
python events_api.py
```

API będzie działać na: `http://localhost:5000`

### 4. Otwórz Panel Admina

Otwórz w przeglądarce: `http://localhost:5000/admin.html`

**Dane logowania:**
- Username: `admin`
- Password: `HAOS2025!`

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

## 📧 Email Templates

System automatycznie wysyła profesjonalne emaile HTML:

### 1. Potwierdzenie rezerwacji (przy submit formularza)
- Wysyłane automatycznie gdy ktoś wypełni formularz rezerwacji
- Zawiera wszystkie szczegóły eventu
- HAOS branding (gradient, neon colors)

### 2. Zatwierdzenie rezerwacji (z panelu admina)
- Wysyłane gdy admin zatwierdzi rezerwację
- Potwierdzenie finalnej rezerwacji

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

## 🔐 Bezpieczeństwo

### Obecnie zaimplementowane:
- Proste logowanie (admin/password)
- Przechowywanie stanu w localStorage

### TODO dla produkcji:
- [ ] JWT tokens
- [ ] Backend authentication
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Input validation & sanitization

## 🌐 Deployment na Vercel

### 1. Backend API

Dodaj do `vercel.json`:

```json
{
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.9"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/events_api.py"
    }
  ]
}
```

### 2. Environment Variables w Vercel

W Vercel Dashboard → Settings → Environment Variables dodaj:

```
MAIL_USERNAME = twoj-email@gmail.com
MAIL_PASSWORD = haslo-aplikacji
ADMIN_USERNAME = admin
ADMIN_PASSWORD = HAOS2025!
```

### 3. Deploy

```bash
git add .
git commit -m "Add admin panel and API"
git push
vercel --prod
```

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
