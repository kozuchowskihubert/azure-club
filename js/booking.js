/* ===========================================
   CLUBBASSE - Booking System with Calendar
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initCalendar();
    initBookingForm();
    initTimeline();
    initGalleryFilter();
    initStatBars();
});

/* ===========================================
   Calendar System
   =========================================== */
class BookingCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.bookedDates = [
            '2025-01-18', '2025-01-25', '2025-02-01', '2025-02-14',
            '2025-02-22', '2025-03-08', '2025-03-15', '2025-03-22'
        ];
        
        this.months = [
            'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
        ];
        
        this.init();
    }
    
    init() {
        this.calendarDays = document.getElementById('calendarDays');
        this.calendarTitle = document.getElementById('calendarTitle');
        this.prevBtn = document.getElementById('prevMonth');
        this.nextBtn = document.getElementById('nextMonth');
        this.eventDateInput = document.getElementById('eventDate');
        
        if (!this.calendarDays) return;
        
        this.render();
        this.bindEvents();
    }
    
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.changeMonth(-1));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.changeMonth(1));
        }
    }
    
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
    }
    
    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update title
        if (this.calendarTitle) {
            this.calendarTitle.textContent = `${this.months[month]} ${year}`;
        }
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
        
        // Clear calendar
        if (this.calendarDays) {
            this.calendarDays.innerHTML = '';
        }
        
        // Add empty cells for days before first day
        for (let i = 0; i < startDay; i++) {
            this.createDayCell('', 'empty');
        }
        
        // Add days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const date = new Date(year, month, day);
            
            let className = 'day';
            
            // Check if past
            if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                className += ' past';
            }
            // Check if booked
            else if (this.bookedDates.includes(dateStr)) {
                className += ' booked';
            }
            // Check if selected
            else if (this.selectedDate === dateStr) {
                className += ' selected';
            }
            // Available
            else {
                className += ' available';
            }
            
            // Check if today
            if (date.toDateString() === today.toDateString()) {
                className += ' today';
            }
            
            this.createDayCell(day, className, dateStr);
        }
    }
    
    createDayCell(content, className, dateStr = null) {
        const cell = document.createElement('div');
        cell.className = className;
        cell.textContent = content;
        
        if (dateStr && className.includes('available')) {
            cell.addEventListener('click', () => this.selectDate(dateStr, cell));
        }
        
        if (this.calendarDays) {
            this.calendarDays.appendChild(cell);
        }
    }
    
    selectDate(dateStr, cell) {
        // Remove previous selection
        const prevSelected = this.calendarDays.querySelector('.selected');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
            prevSelected.classList.add('available');
        }
        
        // Select new date
        cell.classList.remove('available');
        cell.classList.add('selected');
        this.selectedDate = dateStr;
        
        // Update form input
        if (this.eventDateInput) {
            const date = new Date(dateStr);
            this.eventDateInput.value = date.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }
}

function initCalendar() {
    new BookingCalendar();
}

/* ===========================================
   Booking Form with API
   =========================================== */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="btn-loader"></span> Wysyłanie...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = {
            eventType: form.eventType.value,
            eventDate: form.eventDate.value,
            eventTime: form.eventTime.value,
            eventLocation: form.eventLocation.value,
            clientName: form.clientName.value,
            clientEmail: form.clientEmail.value,
            clientPhone: form.clientPhone.value,
            eventDetails: form.eventDetails.value,
            timestamp: new Date().toISOString()
        };
        
        try {
            // Simulate API call (replace with real API endpoint)
            await sendBookingRequest(formData);
            
            // Success
            showBookingSuccess(form, submitBtn, originalText);
            
        } catch (error) {
            // Error
            showBookingError(form, submitBtn, originalText, error.message);
        }
    });
}

async function sendBookingRequest(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, replace with real API call:
    /*
    const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Błąd wysyłania zapytania');
    }
    
    return response.json();
    */
    
    // For demo, save to localStorage
    const bookings = JSON.parse(localStorage.getItem('clubbasse_bookings') || '[]');
    bookings.push({ ...data, id: Date.now(), status: 'pending' });
    localStorage.setItem('clubbasse_bookings', JSON.stringify(bookings));
    
    // Send email notification (would be done by backend)
    console.log('Booking request:', data);
    
    return { success: true, message: 'Zapytanie zostało wysłane' };
}

function showBookingSuccess(form, btn, originalText) {
    btn.innerHTML = '✓ Wysłano!';
    btn.style.background = '#4CAF50';
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'booking-success';
    successMsg.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>Dziękujemy za zapytanie!</h3>
        <p>Otrzymasz potwierdzenie na podany adres email. Skontaktujemy się z Tobą w ciągu 24 godzin.</p>
    `;
    form.parentNode.insertBefore(successMsg, form);
    form.style.display = 'none';
    
    // Reset after delay
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        successMsg.remove();
    }, 5000);
}

function showBookingError(form, btn, originalText, message) {
    btn.innerHTML = '✗ Błąd';
    btn.style.background = '#f44336';
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'booking-error';
    errorMsg.innerHTML = `
        <p>❌ ${message || 'Wystąpił błąd. Spróbuj ponownie później.'}</p>
    `;
    form.insertBefore(errorMsg, form.firstChild);
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        errorMsg.remove();
    }, 3000);
}

/* ===========================================
   Timeline Slider (HAOS.fm style)
   =========================================== */
function initTimeline() {
    const slider = document.getElementById('timelineSlider');
    const progress = document.getElementById('timelineProgress');
    const prevBtn = document.getElementById('timelinePrev');
    const nextBtn = document.getElementById('timelineNext');
    
    if (!slider) return;
    
    const items = slider.querySelectorAll('.timeline-item');
    let currentIndex = 0;
    
    function updateTimeline(index) {
        // Clamp index
        index = Math.max(0, Math.min(index, items.length - 1));
        currentIndex = index;
        
        // Update active item
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        // Update progress bar
        if (progress) {
            const percent = (index / (items.length - 1)) * 100;
            progress.style.width = `${percent}%`;
        }
        
        // Scroll item into view on mobile
        if (window.innerWidth < 768) {
            items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => updateTimeline(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => updateTimeline(currentIndex + 1));
    }
    
    // Click on timeline items
    items.forEach((item, index) => {
        item.addEventListener('click', () => updateTimeline(index));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('#timeline')) {
            if (e.key === 'ArrowLeft') updateTimeline(currentIndex - 1);
            if (e.key === 'ArrowRight') updateTimeline(currentIndex + 1);
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                updateTimeline(currentIndex + 1);
            } else {
                updateTimeline(currentIndex - 1);
            }
        }
    });
    
    // Auto-play option
    let autoPlay = false;
    if (autoPlay) {
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % items.length;
            updateTimeline(nextIndex);
        }, 5000);
    }
}

/* ===========================================
   Gallery Filter
   =========================================== */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        if (item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            openLightbox(item);
        });
    });
}

function openLightbox(item) {
    const overlay = item.querySelector('.gallery-overlay');
    const title = overlay.querySelector('h3').textContent;
    const subtitle = overlay.querySelector('p').textContent;
    const iconEl = item.querySelector('.gallery-icon');
    const icon = iconEl ? iconEl.textContent : '🎧';
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <div class="lightbox-icon">${icon}</div>
            <h3>${title}</h3>
            <p>${subtitle}</p>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
        lightbox.classList.add('active');
    });
    
    // Close handlers
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', handleLightboxKeydown);
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
        document.removeEventListener('keydown', handleLightboxKeydown);
    }
    
    function handleLightboxKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
    }
}

/* ===========================================
   Stat Bars Animation
   =========================================== */
function initStatBars() {
    const statBars = document.querySelectorAll('.stat-bar-fill');
    
    if (!statBars.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.dataset.percent || 100;
                
                setTimeout(() => {
                    bar.style.width = `${percent}%`;
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    statBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

/* ===========================================
   API Endpoints (for Azure Functions)
   =========================================== */
const API = {
    // Base URL for Azure Functions
    baseUrl: '/api',
    
    // Send booking request
    async createBooking(data) {
        const response = await fetch(`${this.baseUrl}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    // Get available dates
    async getAvailability(month, year) {
        const response = await fetch(`${this.baseUrl}/availability?month=${month}&year=${year}`);
        return response.json();
    },
    
    // Send contact message
    async sendMessage(data) {
        const response = await fetch(`${this.baseUrl}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }
};

/* ===========================================
   Initialize on page load
   =========================================== */
console.log('%c CLUBBASSE Booking System Loaded ', 'background: #1a237e; color: #C0C0C0; padding: 5px 10px;');
