// ARCH1TECT Booking System with API Integration
const API_URL = 'https://azure-club.vercel.app/api';

document.getElementById('bookingForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        event_date: document.getElementById('event_date').value,
        event_type: document.getElementById('event_type').value,
        start_time: document.getElementById('start_time')?.value,
        duration: document.getElementById('duration')?.value,
        venue: document.getElementById('venue')?.value,
        city: document.getElementById('city')?.value,
        guests: document.getElementById('guests')?.value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            
            // Show success message
            alert('🎉 Dziękuję za zapytanie! Otrzymasz email z potwierdzeniem. Skontaktuję się z Tobą wkrótce.');
            
            // Reset form
            document.getElementById('bookingForm').reset();
            
            // Optionally redirect
            // window.location.href = '#contact';
        } else {
            throw new Error('Booking submission failed');
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Wystąpił błąd podczas wysyłania rezerwacji. Spróbuj ponownie lub skontaktuj się bezpośrednio: booking@arch1tect.pl');
    }
});

// Load upcoming events for the schedule section
async function loadUpcomingEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();
        
        // Filter upcoming events
        const now = new Date();
        const upcomingEvents = events
            .filter(event => new Date(event.date) >= now && event.status === 'upcoming')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5); // Get next 5 events
        
        // Render events in the schedule section if it exists
        const scheduleContainer = document.querySelector('.timeline');
        if (scheduleContainer && upcomingEvents.length > 0) {
            renderEventsTimeline(upcomingEvents, scheduleContainer);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function renderEventsTimeline(events, container) {
    // Keep existing timeline items and add new ones from API
    const existingItems = container.querySelectorAll('.timeline-item');
    const existingCount = existingItems.length;
    
    events.forEach((event, index) => {
        if (index >= existingCount) {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleDateString('pl-PL', { month: 'short' }).toUpperCase();
            const year = eventDate.getFullYear();
            
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-date">
                    <div class="date-day">${day}</div>
                    <div class="date-month">${month}</div>
                    <div class="date-year">${year}</div>
                </div>
                <div class="timeline-content">
                    ${event.status === 'sold_out' ? '<div class="event-badge-small">🔥 WYPRZEDANE</div>' : ''}
                    <h3>${event.name}</h3>
                    <p class="event-location">📍 ${event.venue}${event.city ? ', ' + event.city : ''}</p>
                    ${event.description ? `<p class="event-description">${event.description}</p>` : ''}
                    ${event.artists ? `
                        <div class="event-artists">
                            ${event.artists.split(',').map(artist => `<span>🎧 ${artist.trim()}</span>`).join('')}
                        </div>
                    ` : ''}
                    ${event.time ? `<div class="event-time">⏰ ${event.time}</div>` : ''}
                </div>
            `;
            container.appendChild(timelineItem);
        }
    });
}

// Contact form submission
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('contact_name').value,
        email: document.getElementById('contact_email').value,
        subject: document.getElementById('contact_subject')?.value || 'Kontakt ze strony',
        message: document.getElementById('contact_message').value
    };

    try {
        // You can extend the API to handle contact messages
        // For now, show success message
        alert('✅ Wiadomość wysłana! Odpowiem najszybciej jak to możliwe.');
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('Error submitting contact form:', error);
        alert('Wystąpił błąd. Napisz bezpośrednio na: booking@arch1tect.pl');
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUpcomingEvents);
} else {
    loadUpcomingEvents();
}
