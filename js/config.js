// Frontend Configuration
// Serverless API on Vercel - No Railway dependency!

const CONFIG = {
    // Backend API URL - Using Vercel Serverless Functions
    API_URL: 'https://azure-club.vercel.app/api', // Serverless API with Neon PostgreSQL
    
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
