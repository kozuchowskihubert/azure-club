/**
 * Calendar Integration Utilities for ARCH1TECT
 * Based on azure-san-bud calendar system
 */

/**
 * Format date for calendar URLs (YYYYMMDDTHHmmssZ)
 */
function formatDateForCalendar(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Create calendar event from event data
 */
function createCalendarEvent(event) {
    // Parse date and time
    const startDate = new Date(`${event.date}T${event.time || '22:00'}:00`);
    
    // Default duration: 4 hours for club events
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 4);
    
    return {
        title: `${event.name} - ARCH1TECT`,
        description: `${event.description || ''}\n\n🎧 Artyści: ${event.artists || 'TBA'}\n🎵 Typ: ${event.type || 'club'}\n💰 Cena: ${event.price ? event.price + ' PLN' : 'Do ogłoszenia'}\n\n📍 Miejsce: ${event.venue}${event.city ? ', ' + event.city : ''}\n\nOrganizator: ARCH1TECT\nEmail: booking@arch1tect.pl`,
        location: `${event.venue}${event.city ? ', ' + event.city : ''}`,
        startDate: startDate,
        endDate: endDate,
        organizer: 'booking@arch1tect.pl'
    };
}

/**
 * Generate Google Calendar URL
 */
function generateGoogleCalendarUrl(calendarEvent) {
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: calendarEvent.title,
        details: calendarEvent.description,
        location: calendarEvent.location,
        dates: `${formatDateForCalendar(calendarEvent.startDate)}/${formatDateForCalendar(calendarEvent.endDate)}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate iCal content for Apple Calendar / Outlook
 */
function generateICalContent(calendarEvent) {
    const now = new Date();
    const uid = `event-${Date.now()}@arch1tect.pl`;

    const ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ARCH1TECT//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatDateForCalendar(now)}`,
        `DTSTART:${formatDateForCalendar(calendarEvent.startDate)}`,
        `DTEND:${formatDateForCalendar(calendarEvent.endDate)}`,
        `SUMMARY:${calendarEvent.title}`,
        `DESCRIPTION:${calendarEvent.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${calendarEvent.location}`,
        `ORGANIZER;CN=ARCH1TECT:MAILTO:${calendarEvent.organizer}`,
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Przypomnienie: Event za 2 godziny!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR',
    ].join('\r\n');

    return ical;
}

/**
 * Download iCal file
 */
function downloadICalFile(calendarEvent, filename = 'arch1tect-event.ics') {
    const icalContent = generateICalContent(calendarEvent);
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate Outlook.com Calendar URL
 */
function generateOutlookCalendarUrl(calendarEvent) {
    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: calendarEvent.title,
        body: calendarEvent.description,
        location: calendarEvent.location,
        startdt: calendarEvent.startDate.toISOString(),
        enddt: calendarEvent.endDate.toISOString(),
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Office 365 Calendar URL
 */
function generateOffice365CalendarUrl(calendarEvent) {
    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: calendarEvent.title,
        body: calendarEvent.description,
        location: calendarEvent.location,
        startdt: calendarEvent.startDate.toISOString(),
        enddt: calendarEvent.endDate.toISOString(),
    });

    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Detect user's preferred calendar
 */
function getPreferredCalendar() {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    if (/iphone|ipad|ipod/.test(userAgent) || platform.includes('mac')) {
        return 'apple';
    } else if (/android/.test(userAgent)) {
        return 'google';
    } else if (/windows/.test(userAgent) || /win/.test(platform)) {
        return 'outlook';
    }

    return 'google'; // Default fallback
}

/**
 * Add event to calendar with platform selection
 */
function addToCalendar(event, platform) {
    const calendarEvent = createCalendarEvent(event);
    const selectedPlatform = platform || getPreferredCalendar();

    switch (selectedPlatform) {
        case 'google':
            window.open(generateGoogleCalendarUrl(calendarEvent), '_blank');
            break;
        case 'apple':
            downloadICalFile(calendarEvent, `arch1tect-${event.name.replace(/\s+/g, '-').toLowerCase()}.ics`);
            break;
        case 'outlook':
            window.open(generateOutlookCalendarUrl(calendarEvent), '_blank');
            break;
        case 'office365':
            window.open(generateOffice365CalendarUrl(calendarEvent), '_blank');
            break;
        default:
            downloadICalFile(calendarEvent);
    }
}

/**
 * Show calendar platform selector modal
 */
function showCalendarSelector(event) {
    const modal = document.createElement('div');
    modal.className = 'calendar-selector-modal';
    modal.innerHTML = `
        <div class="calendar-selector-content">
            <span class="calendar-selector-close">&times;</span>
            <h3>📅 Dodaj do kalendarza</h3>
            <p>Wybierz swoją platformę kalendarzową:</p>
            <div class="calendar-options">
                <button class="calendar-option" data-platform="google">
                    <div class="calendar-icon" style="background: linear-gradient(135deg, #4285F4, #34A853);">
                        <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                        </svg>
                    </div>
                    <div class="calendar-label">
                        <strong>Google Calendar</strong>
                        <small>Otwórz w przeglądarce</small>
                    </div>
                </button>
                
                <button class="calendar-option" data-platform="apple">
                    <div class="calendar-icon" style="background: linear-gradient(135deg, #000, #333);">
                        <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <div class="calendar-label">
                        <strong>Apple Calendar</strong>
                        <small>Pobierz plik .ics</small>
                    </div>
                </button>
                
                <button class="calendar-option" data-platform="outlook">
                    <div class="calendar-icon" style="background: linear-gradient(135deg, #0078D4, #50E6FF);">
                        <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                            <path d="M7 22h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H7C5.9 2 5 2.9 5 4v16c0 1.1.9 2 2 2zm5-18c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                        </svg>
                    </div>
                    <div class="calendar-label">
                        <strong>Outlook</strong>
                        <small>Outlook.com</small>
                    </div>
                </button>
                
                <button class="calendar-option" data-platform="office365">
                    <div class="calendar-icon" style="background: linear-gradient(135deg, #D83B01, #FF8C00);">
                        <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                    </div>
                    <div class="calendar-label">
                        <strong>Office 365</strong>
                        <small>Microsoft 365</small>
                    </div>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.calendar-selector-close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    modal.querySelectorAll('.calendar-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            addToCalendar(event, platform);
            document.body.removeChild(modal);
        });
    });

    // Add animation
    setTimeout(() => modal.classList.add('active'), 10);
}
