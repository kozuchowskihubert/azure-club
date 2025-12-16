// Frontend Configuration
// Local development: http://localhost:5001/api
// Production: Update after Railway deployment

const CONFIG = {
    // Backend API URL - Currently using local backend
    API_URL: 'http://localhost:5001/api', // Local backend with Neon PostgreSQL
    
    // Railway URL will be like:
    // API_URL: 'https://azure-club-production.up.railway.app/api',
    
    // Frontend URLs (Vercel)
    FRONTEND_URL: 'https://azure-club.vercel.app',
    
    // Email
    CONTACT_EMAIL: 'arch1tect@haos.fm',
    
    // Calendar platforms
    CALENDAR_PLATFORMS: ['google', 'apple', 'outlook', 'office365']
};

// Export for use in scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
