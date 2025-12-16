// Frontend Configuration
// Update this file after Railway deployment

const CONFIG = {
    // Backend API URL - UPDATE THIS after Railway deployment
    API_URL: 'https://azure-club.vercel.app/api', // TEMPORARY - zmień na Railway URL
    
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
