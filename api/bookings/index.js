/**
 * Azure Function API for Booking Management
 * Handles GET (fetch bookings) and POST (create booking) requests
 */

const fs = require('fs');
const path = require('path');

// Simple JSON file storage (for demo - use database in production)
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');

// Initialize bookings file if it doesn't exist
function initBookingsFile() {
    if (!fs.existsSync(BOOKINGS_FILE)) {
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([]));
    }
}

// Read bookings from file
function getBookings() {
    try {
        initBookingsFile();
        const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading bookings:', error);
        return [];
    }
}

// Save bookings to file
function saveBookings(bookings) {
    try {
        fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving bookings:', error);
        return false;
    }
}

// Validate booking data
function validateBooking(data) {
    const required = ['date', 'name', 'email', 'eventType', 'venue'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
        return { valid: false, error: `Missing required fields: ${missing.join(', ')}` };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return { valid: false, error: 'Invalid email format' };
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
        return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD' };
    }
    
    return { valid: true };
}

// Main Azure Function handler
module.exports = async function (context, req) {
    context.log('Booking API endpoint hit');
    
    // Set CORS headers
    context.res = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };
    
    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }
    
    try {
        // GET - Fetch all bookings or booked dates
        if (req.method === 'GET') {
            const bookings = getBookings();
            const datesOnly = req.query.datesOnly === 'true';
            
            if (datesOnly) {
                // Return only dates that are booked
                const bookedDates = bookings
                    .filter(b => b.status === 'pending' || b.status === 'confirmed')
                    .map(b => b.date);
                
                context.res.status = 200;
                context.res.body = {
                    success: true,
                    dates: bookedDates
                };
            } else {
                // Return all bookings (admin view)
                context.res.status = 200;
                context.res.body = {
                    success: true,
                    bookings: bookings
                };
            }
        }
        
        // POST - Create new booking
        else if (req.method === 'POST') {
            const bookingData = req.body;
            
            // Validate data
            const validation = validateBooking(bookingData);
            if (!validation.valid) {
                context.res.status = 400;
                context.res.body = {
                    success: false,
                    error: validation.error
                };
                return;
            }
            
            // Check if date is already booked
            const bookings = getBookings();
            const existingBooking = bookings.find(b => 
                b.date === bookingData.date && 
                (b.status === 'pending' || b.status === 'confirmed')
            );
            
            if (existingBooking) {
                context.res.status = 409;
                context.res.body = {
                    success: false,
                    error: 'This date is already booked'
                };
                return;
            }
            
            // Create new booking
            const newBooking = {
                id: Date.now().toString(),
                ...bookingData,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            bookings.push(newBooking);
            
            if (saveBookings(bookings)) {
                context.res.status = 201;
                context.res.body = {
                    success: true,
                    booking: newBooking,
                    message: 'Booking request submitted successfully'
                };
                
                // TODO: Send email notification
                context.log('New booking created:', newBooking.id);
            } else {
                context.res.status = 500;
                context.res.body = {
                    success: false,
                    error: 'Failed to save booking'
                };
            }
        }
        
        else {
            context.res.status = 405;
            context.res.body = {
                success: false,
                error: 'Method not allowed'
            };
        }
        
    } catch (error) {
        context.log.error('Error processing request:', error);
        context.res.status = 500;
        context.res.body = {
            success: false,
            error: 'Internal server error'
        };
    }
};
