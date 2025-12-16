# ARCH1TECT Booking API# ARCH1TECT Booking API



Python Flask REST API for managing DJ event bookings with email notifications and calendar integration.REST API for managing DJ booking requests using Azure Functions.



## 📋 Overview## 📋 Overview



This is a professional booking API system built with Python Flask, designed for ARCH1TECT DJ services. The API handles event bookings, customer management, service catalog, and automated email notifications for both customers and administrators.This API handles booking requests for ARCH1TECT DJ performances. It stores bookings in a JSON file (for demo) and can be easily upgraded to use a database like Azure Cosmos DB or Azure SQL.



## ✨ Features## 🚀 Endpoints



- **DJ Event Booking Management** - Create, track, and manage DJ event bookings### GET /api/bookings

- **Customer Database** - Store and manage customer information with booking historyFetch all bookings or just booked dates.

- **Service Catalog** - Multiple DJ service packages with flexible pricing

- **Availability Checking** - Prevent double-bookings with date/time validation**Query Parameters:**

- **Email Notifications** - Professional HTML emails for booking confirmations- `datesOnly=true` - Returns only booked dates (for calendar)

- **Calendar Integration** - Support for adding events to customer calendars

- **Contact Form** - Handle customer inquiries with email forwarding**Response:**

- **Admin Notifications** - Instant alerts for new bookings with customer details```json

{

## 🛠️ Tech Stack  "success": true,

  "dates": ["2025-12-20", "2025-12-27", "2025-12-31"]

- **Framework**: Flask 3.0.0}

- **Database**: SQLAlchemy 2.0.23 with Flask-SQLAlchemy 3.1.1```

- **Database Engine**: SQLite (development) / PostgreSQL (production)

- **Email**: Flask-Mail 0.9.1 with Gmail SMTP### POST /api/bookings

- **CORS**: Flask-CORS 4.0.0Create a new booking request.

- **Migrations**: Flask-Migrate 4.0.5

- **Server**: Gunicorn 21.2.0 (production)**Request Body:**

- **Python**: 3.11+```json

{

## 📁 Project Structure  "date": "2025-12-25",

  "name": "Jan Kowalski",

```  "email": "jan@example.com",

api/  "phone": "+48 123 456 789",

├── __init__.py              # Flask app factory with config  "eventType": "club",

├── requirements.txt         # Python dependencies  "venue": "Club XYZ",

├── init_db.py              # Database initialization script  "message": "New Year's Eve party, 10PM-4AM, expected 500 people"

├── .env.example            # Environment variables template}

├── models/```

│   ├── __init__.py

│   ├── customer.py         # Customer model**Response:**

│   ├── dj_booking.py       # DJ booking model```json

│   ├── event_service.py    # Service packages model{

│   └── notification.py     # Notification tracking model  "success": true,

├── routes/  "booking": {

│   ├── __init__.py    "id": "1702648800000",

│   ├── api.py              # Main API endpoints    "date": "2025-12-25",

│   └── bookings.py         # Admin booking routes    "name": "Jan Kowalski",

└── config/    "email": "jan@example.com",

    └── email.py            # Email notification system    "status": "pending",

```    "createdAt": "2025-12-11T10:30:00.000Z"

  },

## 🚀 Getting Started  "message": "Booking request submitted successfully"

}

### Prerequisites```



- Python 3.11 or higher## 🛠️ Local Development

- pip (Python package manager)

- Gmail account for SMTP (or other email service)### Prerequisites

- Node.js 18+

### Installation- Azure Functions Core Tools (optional, for local testing)



1. **Clone the repository**:### Setup

```bash

cd azure-club1. **Install Azure Functions Core Tools (optional):**

``````bash

npm install -g azure-functions-core-tools@4

2. **Create virtual environment**:```

```bash

python3 -m venv venv2. **Test API locally:**

source venv/bin/activate  # On macOS/Linux```bash

# orcd api

venv\Scripts\activate  # On Windowsfunc start

``````



3. **Install dependencies**:3. **Test endpoints:**

```bash```bash

pip install -r api/requirements.txt# Get booked dates

```curl http://localhost:7071/api/bookings?datesOnly=true



4. **Configure environment variables**:# Create booking

```bashcurl -X POST http://localhost:7071/api/bookings \

cp api/.env.example api/.env  -H "Content-Type: application/json" \

# Edit api/.env with your settings:  -d '{

# - SECRET_KEY (generate with: python -c 'import secrets; print(secrets.token_hex(32))')    "date": "2025-12-25",

# - MAIL_USERNAME (your Gmail address)    "name": "Test User",

# - MAIL_PASSWORD (Gmail app password)    "email": "test@example.com",

# - BOOKING_EMAIL (admin email for notifications)    "eventType": "club",

```    "venue": "Test Club"

  }'

5. **Initialize database**:```

```bash

python api/init_db.py## 📦 Deployment to Azure

```

### Option 1: Azure Static Web Apps (Integrated API)

6. **Run the development server**:Your Azure Static Web App automatically detects and deploys the `/api` folder as serverless functions.

```bash

python run_api.py1. Push changes to GitHub:

``````bash

git add api/

The API will be available at `http://localhost:5000`git commit -m "Add booking API"

git push

## 📊 Database Models```



### Customer2. Azure Static Web Apps will automatically deploy the API to:

- Stores customer contact information and booking history```

- Fields: first_name, last_name, email (unique), phone, company, address, city, postal_codehttps://your-app.azurestaticapps.net/api/bookings

- Relationship: One-to-many with bookings```



### DJBooking### Option 2: Standalone Azure Functions

- Main booking entity for DJ eventsDeploy as a separate Azure Functions app:

- Event details: event_date, event_time, event_duration_hours, event_type

- Venue info: venue_name, venue_address, venue_city```bash

- Booking data: status, guest_count, special_requests, budget# Login to Azure

- Notification tracking: confirmation_sent, reminder_sentaz login

- Calendar integration: calendar_event_sent, calendar_platforms

- Status values: pending, confirmed, completed, cancelled# Create Function App

az functionapp create \

### EventService  --resource-group azure-club-rg \

- DJ service packages and pricing  --consumption-plan-location westeurope \

- Pricing: base_price, price_per_hour, min_hours, max_hours  --runtime node \

- Features: includes_equipment, includes_lighting, includes_mc_services  --runtime-version 18 \

- Service types: dj_set_club, dj_set_festival, production, workshop  --functions-version 4 \

  --name arch1tect-booking-api \

### Notification  --storage-account arch1tectstorage

- Tracks all email/SMS notifications

- Types: booking_confirmation, reminder, cancellation, update# Deploy

- Channels: email, sms, bothfunc azure functionapp publish arch1tect-booking-api

- Status: pending, sent, failed```



## 🔌 API Endpoints## 🔧 Configuration



### Health Check### Enable Real API (Production)

```Update `js/script.js`:

GET /api/health

``````javascript

Returns API status and version.const BookingAPI = {

    baseURL: '/api/bookings',

**Response**:    useMockData: false, // Switch to real API

```json    // ...

{};

  "status": "healthy",```

  "message": "ARCH1TECT Booking API is running",

  "version": "1.0.0"### Database Integration

}To use a real database instead of JSON file:

```

1. **Azure Cosmos DB:**

### List Services```javascript

```const { CosmosClient } = require("@azure/cosmos");

GET /api/services

```const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);

Get all available DJ service packages.const database = client.database("arch1tect");

const container = database.container("bookings");

**Response**:

```json// Save booking

{await container.items.create(bookingData);

  "services": [

    {// Get bookings

      "id": 1,const { resources } = await container.items.query("SELECT * FROM c").fetchAll();

      "name": "DJ Set - Klub",```

      "description": "Profesjonalny DJ set na event klubowy",

      "service_type": "dj_set_club",2. **Azure SQL:**

      "base_price": 1500.0,```javascript

      "price_per_hour": 400.0,const sql = require('mssql');

      "min_hours": 2,

      "max_hours": 6,const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);

      "includes_equipment": true,await pool.request()

      "includes_lighting": false,    .input('date', sql.Date, bookingData.date)

      "includes_mc_services": false    .input('name', sql.NVarChar, bookingData.name)

    }    .query('INSERT INTO Bookings (date, name, email, ...) VALUES (@date, @name, ...)');

  ]```

}

```## 📧 Email Notifications



### Check AvailabilityAdd SendGrid integration to notify you of new bookings:

```

POST /api/check-availability```javascript

Content-Type: application/jsonconst sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

{

  "event_date": "2024-03-15",const msg = {

  "event_time": "20:00"  to: 'your-email@example.com',

}  from: 'bookings@arch1tect.com',

```  subject: `New Booking Request - ${bookingData.date}`,

  html: `

**Response**:    <h2>New Booking Request</h2>

```json    <p><strong>Date:</strong> ${bookingData.date}</p>

{    <p><strong>Name:</strong> ${bookingData.name}</p>

  "available": true,    <p><strong>Email:</strong> ${bookingData.email}</p>

  "message": "Date is available"    <p><strong>Venue:</strong> ${bookingData.venue}</p>

}    <p><strong>Event Type:</strong> ${bookingData.eventType}</p>

```    <p><strong>Message:</strong> ${bookingData.message}</p>

  `

### Contact Form};

```

POST /api/contactawait sgMail.send(msg);

Content-Type: application/json```



{## 🔐 Security

  "name": "Jan Kowalski",

  "email": "jan@example.com",### Recommended Improvements:

  "phone": "+48123456789",1. **Add API Key Authentication:**

  "message": "Pytanie o dostępność na 15 marca"```javascript

}const apiKey = req.headers['x-api-key'];

```if (apiKey !== process.env.API_KEY) {

    context.res = { status: 401, body: 'Unauthorized' };

### Book Event    return;

```}

POST /api/book-event```

Content-Type: application/json

2. **Rate Limiting:**

{Use Azure API Management or implement custom rate limiting.

  "first_name": "Jan",

  "last_name": "Kowalski",3. **Data Validation:**

  "email": "jan@example.com",Already implemented - validates required fields and email format.

  "phone": "+48123456789",

  "event_date": "2024-03-15",4. **CORS Configuration:**

  "event_time": "20:00",Currently allows all origins (`*`). For production, specify your domain:

  "event_duration_hours": 4,```javascript

  "event_type": "club",'Access-Control-Allow-Origin': 'https://your-domain.azurestaticapps.net'

  "venue_name": "Klub Muzyczny",```

  "venue_address": "ul. Przykładowa 123",

  "venue_city": "Warszawa",## 📊 Booking Statuses

  "guest_count": 150,

  "special_requests": "Proszę o muzykę house",- `pending` - New booking request, awaiting confirmation

  "service_id": 1- `confirmed` - Booking confirmed by artist

}- `cancelled` - Booking cancelled

```- `completed` - Event completed



**Response**:## 🧪 Testing

```json

{Test the mock API (localStorage):

  "message": "Booking created successfully",```javascript

  "booking_id": 42,// In browser console

  "confirmation_sent": truelocalStorage.setItem('arch1tect_bookings', JSON.stringify([

}  {

```    "id": "1",

    "date": "2025-12-20",

## 📧 Email Notifications    "status": "confirmed"

  }

The API sends professional HTML emails with dark theme and ARCH1TECT branding:]));

```

### Customer Confirmation Email

- Gradient header (crimson to purple)## 📝 License

- Event details table with icons

- Venue informationMIT License - Part of ARCH1TECT portfolio website

- Special requests section
- Important preparation instructions
- Contact button with gradient
- Calendar integration instructions

### Admin Notification Email
- Customer contact details (clickable phone/email)
- Complete event information
- Special requests highlighting
- Action required notice
- Direct contact links

### Email Configuration
Set up Gmail SMTP in `.env`:
```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
BOOKING_EMAIL=admin@arch1tect.com
```

**Note**: For Gmail, you need to create an [App Password](https://support.google.com/accounts/answer/185833) instead of using your regular password.

## 🚀 Deployment

### Azure App Service (Recommended)

1. **Create Azure App Service** (Python 3.11):
```bash
az webapp up --name arch1tect-booking-api --runtime "PYTHON:3.11" --sku B1
```

2. **Configure PostgreSQL Database**:
```bash
az postgres flexible-server create \
  --name arch1tect-db \
  --resource-group your-resource-group \
  --location eastus \
  --admin-user dbadmin \
  --admin-password YourPassword123! \
  --sku-name Standard_B1ms
```

3. **Set environment variables**:
```bash
az webapp config appsettings set --name arch1tect-booking-api \
  --settings \
  SECRET_KEY="your-secret-key" \
  DATABASE_URL="postgresql://dbadmin:YourPassword123!@arch1tect-db.postgres.database.azure.com/bookings" \
  MAIL_USERNAME="your-email@gmail.com" \
  MAIL_PASSWORD="your-app-password" \
  BOOKING_EMAIL="admin@arch1tect.com"
```

4. **Deploy**:
```bash
git add .
git commit -m "Add Flask booking API"
git push azure main
```

5. **Initialize database**:
```bash
az webapp ssh --name arch1tect-booking-api
python api/init_db.py
```

## 🔗 Frontend Integration

The API is designed to work with Next.js/React frontends. Example integration:

```javascript
// Book an event
const bookEvent = async (bookingData) => {
  const response = await fetch('https://your-api.azurewebsites.net/api/book-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
  });
  
  return await response.json();
};

// Check availability
const checkAvailability = async (date, time) => {
  const response = await fetch('https://your-api.azurewebsites.net/api/check-availability', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_date: date,
      event_time: time
    })
  });
  
  return await response.json();
};
```

## 🧪 Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Get services
curl http://localhost:5000/api/services

# Check availability
curl -X POST http://localhost:5000/api/check-availability \
  -H "Content-Type: application/json" \
  -d '{"event_date":"2024-03-15","event_time":"20:00"}'

# Book event
curl -X POST http://localhost:5000/api/book-event \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"Jan",
    "last_name":"Kowalski",
    "email":"jan@example.com",
    "phone":"+48123456789",
    "event_date":"2024-03-15",
    "event_time":"20:00",
    "event_duration_hours":4,
    "event_type":"club",
    "venue_name":"Klub Muzyczny",
    "venue_address":"ul. Przykładowa 123",
    "venue_city":"Warszawa",
    "service_id":1
  }'
```

## 📝 License

This project is part of the ARCH1TECT portfolio website.

## 👨‍💻 Author

**ARCH1TECT**
- Website: https://lively-river-087542903.3.azurestaticapps.net
- Email: Configure in BOOKING_EMAIL environment variable

---

Built with Flask and ❤️ for professional DJ services
