// Frontend Configuration
// Using Railway backend (stable) while debugging Vercel serverless

const CONFIG = {
    // Backend API URL - Using Railway (fallback while fixing Vercel)
    API_URL: 'https://azure-club-production.up.railway.app/api', // Railway backend with Neon PostgreSQL
    
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
