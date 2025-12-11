# ARCH1TECT - DJ Booking Portfolio

Aggressive, modern DJ portfolio website with dual light/dark themes, interactive booking calendar, and integrated media embeds. Built for Azure Static Web Apps.

## 🚀 Overview

ARCH1TECT is a cutting-edge DJ portfolio featuring:
- **Dual Theme System**: Aggressive dark (navy/crimson) and sleek light (silver) themes
- **Interactive Booking Calendar**: Click-to-book calendar with real-time availability
- **REST API Integration**: Azure Functions backend for booking management
- **Media Embeds**: Integrated Spotify playlists and YouTube performances
- **Responsive Design**: Mobile-first, optimized for all devices

## ✨ Key Features

### 🎨 Dual Theme System
- **Dark Theme**: Navy (#000080), Crimson (#DC143C), Silver (#C0C0C0) - aggressive, powerful
- **Light Theme**: Silver backgrounds (#F5F5F5), white cards - clean, professional
- Theme toggle with localStorage persistence
- Smooth transitions between themes

### 📅 Interactive Booking Calendar
- Monthly calendar view with weekday/weekend distinction
- **Red weekends** = Prime time bookings
- **Silver weekdays** = Regular availability
- Click any available date to open booking form
- Real-time booking status updates
- Booked dates marked with lock icon 🔒

### 🎵 Media Integration
- **Spotify Embed**: Latest tracks and playlists
- **YouTube Embed**: Performance videos and DJ sets
- Direct links to Spotify, YouTube, and Beatport profiles
- Responsive media players

### 🔌 REST API Backend
- **Azure Functions** serverless API
- GET `/api/bookings?datesOnly=true` - Fetch booked dates
- POST `/api/bookings` - Submit booking request
- JSON file storage (upgradable to Cosmos DB)
- Email notifications ready (SendGrid integration)

### 📱 Responsive Design
- Mobile-first approach
- Optimized for phones, tablets, desktops
- Touch-friendly calendar interface
- Hamburger menu for mobile navigation

## 🛠️ Tech Stack

### Frontend
- **Vanilla JavaScript** with ES6+ features
- **Custom CSS3** with CSS Variables for theming
- **Google Fonts**: Teko (aggressive headings), Rajdhani (technical body)
- **Gradient Effects**: Crimson, silver, and navy gradients with metallic shine

### Backend
- **Azure Functions** (Node.js 18+)
- **REST API** with CORS support
- **JSON File Storage** (demo) - upgradable to:
  - Azure Cosmos DB
  - Azure SQL Database
  - Azure Table Storage

### Hosting & Deployment
- **Azure Static Web Apps** with automatic CI/CD
- **GitHub Actions** for deployment pipeline
- **Custom Domain** support
- **SSL/HTTPS** by default

## 📁 Project Structure

```
azure-club/
├── index.html              # Main HTML structure
├── css/
│   └── styles.css          # Complete styling (3000+ lines)
├── js/
│   └── script.js           # All JavaScript functionality
├── images/                 # Image assets
│   ├── clubbasse.png       # Logo
│   ├── arch1tect-hero.jpg  # Hero image (needs manual save)
│   └── gallery/            # Portfolio gallery images
├── api/                    # Azure Functions API
│   ├── bookings/
│   │   ├── index.js        # Booking endpoint logic
│   │   ├── function.json   # Function configuration
│   │   └── bookings.json   # JSON data store
│   ├── host.json           # Azure Functions host config
│   ├── package.json        # API dependencies
│   └── README.md           # API documentation
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD pipeline
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (for local API testing)
- **Azure CLI** (optional, for manual deployment)
- **Git** for version control
- A modern web browser

### Local Development

```bash
# Clone the repository
git clone https://github.com/kozuchowskihubert/azure-club.git
cd azure-club

# Option 1: Simple HTTP server
npx serve . -l 3000

# Option 2: Python HTTP server
python3 -m http.server 3000

# Open browser
open http://localhost:3000
```

The booking calendar will use **localStorage** for demo purposes. To test:
1. Click any available calendar day
2. Fill out the booking form
3. Submit - the date will be marked as booked
4. Refresh page - bookings persist in localStorage

### 🎵 Configure Media Embeds

#### Spotify Setup
1. Go to your [Spotify for Artists](https://artists.spotify.com/) dashboard
2. Copy your Artist ID from the URL: `https://open.spotify.com/artist/YOUR_ARTIST_ID`
3. Update `index.html` line ~476:
```html
src="https://open.spotify.com/embed/artist/YOUR_ARTIST_ID?utm_source=generator&theme=0"
```

#### YouTube Setup
1. Go to your YouTube video
2. Click "Share" → "Embed"
3. Copy the video ID from: `https://www.youtube.com/embed/YOUR_VIDEO_ID`
4. Update `index.html` line ~487:
```html
src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
```

### 🚀 Deploy to Azure

Azure Static Web Apps **automatically deploys** on every push to `main` branch via GitHub Actions.

```bash
# Add and commit your changes
git add .
git commit -m "Add booking calendar and media embeds"
git push origin main

# GitHub Actions will automatically deploy to:
# https://lively-river-087542903.3.azurestaticapps.net
```

The `/api` folder is automatically deployed as Azure Functions!

### 🔧 Enable Production API

Once deployed, switch from localStorage to real API:

**Edit `js/script.js` line ~503:**
```javascript
const BookingAPI = {
    baseURL: '/api/bookings',
    useMockData: false, // ✅ Change to false for production
    // ...
};
```

## 📖 API Documentation

See [`api/README.md`](api/README.md) for complete API documentation including:
- Endpoint specifications
- Request/response examples
- Database upgrade guides (Cosmos DB, SQL)
- Email notification setup (SendGrid)
- Security best practices

## 🎨 Customization

### Colors (CSS Variables)
Edit `css/styles.css` lines 6-50 to customize the color scheme:

```css
:root {
    /* Dark Theme */
    --navy: #000080;
    --crimson: #DC143C;
    --silver: #C0C0C0;
    /* ... */
}

body.light-theme {
    /* Light Theme overrides */
    --bg-primary: #F5F5F5;
    /* ... */
}
```

### Fonts
Currently using:
- **Teko** - Aggressive, geometric headings
- **Rajdhani** - Technical, clean body text

Change in `index.html` line 8 and CSS font-family properties.

## 🔐 Security

- **HTTPS Only**: SSL enforced by Azure Static Web Apps
- **CORS Configured**: API accepts requests from your domain
- **Input Validation**: All form inputs validated client and server-side
- **Rate Limiting**: Ready for Azure API Management integration
- **Data Privacy**: Booking data stored securely, can upgrade to encrypted Cosmos DB

## 📊 Features Roadmap

### ✅ Completed
- [x] Dual theme system (Dark/Light)
- [x] Interactive booking calendar
- [x] REST API with Azure Functions
- [x] Spotify/YouTube embeds
- [x] Responsive mobile design
- [x] Theme persistence (localStorage)
- [x] Booking form modal
- [x] Calendar click-to-book

### 🚧 In Progress
- [ ] Email notifications (SendGrid)
- [ ] Admin dashboard for booking management
- [ ] Database upgrade (Cosmos DB)

### 🔮 Future
- [ ] Multi-language support (EN/PL)
- [ ] Social media auto-posting
- [ ] Payment integration (Stripe)
- [ ] Availability rules engine
- [ ] iCalendar export

## 🌍 Live Demo

**Production Site**: https://lively-river-087542903.3.azurestaticapps.net

**Test Features**:
1. 🌗 Toggle between dark/light themes
2. 📅 Click any available calendar date
3. 📝 Submit a test booking
4. 🎵 Listen to embedded Spotify tracks
5. 📺 Watch YouTube performances

## 📝 License

MIT License

## 👤 Author

**ARCH1TECT** - DARKNESS • POWER • TECHNO

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

## 📧 Contact

For bookings and inquiries, use the booking calendar or contact form on the live site.
