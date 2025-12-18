// Frontend Configuration
// Production setup with Vercel frontend + Railway backend

const CONFIG = {
    // Backend API URL - Using Railway backend with Neon PostgreSQL
    API_URL: 'https://azure-club-production.up.railway.app/api',
    
    // Frontend URLs (Vercel)
    FRONTEND_URL: 'https://azure-club-events.vercel.app',
    
    // Email
    CONTACT_EMAIL: 'arch1tect@haos.fm',
    
    // Calendar platforms
    CALENDAR_PLATFORMS: ['google', 'apple', 'outlook', 'office365']
};

// Export for use in scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
