# ARCH1TECT Booking API

REST API for managing DJ booking requests using Azure Functions.

## 📋 Overview

This API handles booking requests for ARCH1TECT DJ performances. It stores bookings in a JSON file (for demo) and can be easily upgraded to use a database like Azure Cosmos DB or Azure SQL.

## 🚀 Endpoints

### GET /api/bookings
Fetch all bookings or just booked dates.

**Query Parameters:**
- `datesOnly=true` - Returns only booked dates (for calendar)

**Response:**
```json
{
  "success": true,
  "dates": ["2025-12-20", "2025-12-27", "2025-12-31"]
}
```

### POST /api/bookings
Create a new booking request.

**Request Body:**
```json
{
  "date": "2025-12-25",
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "phone": "+48 123 456 789",
  "eventType": "club",
  "venue": "Club XYZ",
  "message": "New Year's Eve party, 10PM-4AM, expected 500 people"
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "1702648800000",
    "date": "2025-12-25",
    "name": "Jan Kowalski",
    "email": "jan@example.com",
    "status": "pending",
    "createdAt": "2025-12-11T10:30:00.000Z"
  },
  "message": "Booking request submitted successfully"
}
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Azure Functions Core Tools (optional, for local testing)

### Setup

1. **Install Azure Functions Core Tools (optional):**
```bash
npm install -g azure-functions-core-tools@4
```

2. **Test API locally:**
```bash
cd api
func start
```

3. **Test endpoints:**
```bash
# Get booked dates
curl http://localhost:7071/api/bookings?datesOnly=true

# Create booking
curl -X POST http://localhost:7071/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-25",
    "name": "Test User",
    "email": "test@example.com",
    "eventType": "club",
    "venue": "Test Club"
  }'
```

## 📦 Deployment to Azure

### Option 1: Azure Static Web Apps (Integrated API)
Your Azure Static Web App automatically detects and deploys the `/api` folder as serverless functions.

1. Push changes to GitHub:
```bash
git add api/
git commit -m "Add booking API"
git push
```

2. Azure Static Web Apps will automatically deploy the API to:
```
https://your-app.azurestaticapps.net/api/bookings
```

### Option 2: Standalone Azure Functions
Deploy as a separate Azure Functions app:

```bash
# Login to Azure
az login

# Create Function App
az functionapp create \
  --resource-group azure-club-rg \
  --consumption-plan-location westeurope \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name arch1tect-booking-api \
  --storage-account arch1tectstorage

# Deploy
func azure functionapp publish arch1tect-booking-api
```

## 🔧 Configuration

### Enable Real API (Production)
Update `js/script.js`:

```javascript
const BookingAPI = {
    baseURL: '/api/bookings',
    useMockData: false, // Switch to real API
    // ...
};
```

### Database Integration
To use a real database instead of JSON file:

1. **Azure Cosmos DB:**
```javascript
const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("arch1tect");
const container = database.container("bookings");

// Save booking
await container.items.create(bookingData);

// Get bookings
const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
```

2. **Azure SQL:**
```javascript
const sql = require('mssql');

const pool = await sql.connect(process.env.SQL_CONNECTION_STRING);
await pool.request()
    .input('date', sql.Date, bookingData.date)
    .input('name', sql.NVarChar, bookingData.name)
    .query('INSERT INTO Bookings (date, name, email, ...) VALUES (@date, @name, ...)');
```

## 📧 Email Notifications

Add SendGrid integration to notify you of new bookings:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'your-email@example.com',
  from: 'bookings@arch1tect.com',
  subject: `New Booking Request - ${bookingData.date}`,
  html: `
    <h2>New Booking Request</h2>
    <p><strong>Date:</strong> ${bookingData.date}</p>
    <p><strong>Name:</strong> ${bookingData.name}</p>
    <p><strong>Email:</strong> ${bookingData.email}</p>
    <p><strong>Venue:</strong> ${bookingData.venue}</p>
    <p><strong>Event Type:</strong> ${bookingData.eventType}</p>
    <p><strong>Message:</strong> ${bookingData.message}</p>
  `
};

await sgMail.send(msg);
```

## 🔐 Security

### Recommended Improvements:
1. **Add API Key Authentication:**
```javascript
const apiKey = req.headers['x-api-key'];
if (apiKey !== process.env.API_KEY) {
    context.res = { status: 401, body: 'Unauthorized' };
    return;
}
```

2. **Rate Limiting:**
Use Azure API Management or implement custom rate limiting.

3. **Data Validation:**
Already implemented - validates required fields and email format.

4. **CORS Configuration:**
Currently allows all origins (`*`). For production, specify your domain:
```javascript
'Access-Control-Allow-Origin': 'https://your-domain.azurestaticapps.net'
```

## 📊 Booking Statuses

- `pending` - New booking request, awaiting confirmation
- `confirmed` - Booking confirmed by artist
- `cancelled` - Booking cancelled
- `completed` - Event completed

## 🧪 Testing

Test the mock API (localStorage):
```javascript
// In browser console
localStorage.setItem('arch1tect_bookings', JSON.stringify([
  {
    "id": "1",
    "date": "2025-12-20",
    "status": "confirmed"
  }
]));
```

## 📝 License

MIT License - Part of ARCH1TECT portfolio website
