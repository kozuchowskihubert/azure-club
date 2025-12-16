/* ===========================================
   ARCH1TECT - JavaScript Functions
   =========================================== */

/* ===========================================
   Hero Image Slider
   =========================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let autoPlayInterval;
    
    function showSlide(index) {
        // Remove active class from all
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slideCount;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slideCount) % slideCount;
        showSlide(prev);
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Navigation button handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoPlay);
        heroSlider.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Start auto-play
    startAutoPlay();
}

/* ===========================================
   Sidebar Navigation
   =========================================== */
function initSidebarNav() {
    const sidebar = document.querySelector('.sidebar-nav');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar) return;
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close sidebar on link click (mobile)
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Active link on scroll
    const sections = Array.from(sidebarLinks).map(link => {
        const href = link.getAttribute('href');
        return document.querySelector(href);
    }).filter(section => section !== null);
    
    function updateActiveLink() {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach((section, index) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            
            if (scrollPos >= top && scrollPos < bottom) {
                sidebarLinks.forEach(link => link.classList.remove('active'));
                sidebarLinks[index]?.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
    
    // Close sidebar on outside click (mobile)
    if (mainContent) {
        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ===========================================
   Fancy Effects & Animations
   =========================================== */
function initFancyEffects() {
    // Fade in sections on scroll
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeInSections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Parallax effect on mouse move
    if (window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const parallaxElements = document.querySelectorAll('.parallax-slow');
            parallaxElements.forEach((el, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Add hover lift to cards
    const cards = document.querySelectorAll('.card, .service-card, .stat-card');
    cards.forEach(card => {
        if (!card.classList.contains('hover-lift')) {
            card.classList.add('hover-lift');
        }
    });
    
    // Add fade-in-section to all main sections
    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        if (!section.classList.contains('fade-in-section')) {
            section.classList.add('fade-in-section');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initHeroSlider();
    initSidebarNav();
    initThemeToggle();
    initParticles();
    initScrollAnimations();
    initSmoothScroll();
    initCounters();
    initFormValidation();
    initFancyEffects();
    
    // Initialize calendar and booking modal
    if (typeof initCalendar === 'function') {
        initCalendar();
    }
    if (typeof initBookingModal === 'function') {
        initBookingModal();
    }
    
});

/* ===========================================
   Theme Toggle - Dark/Light Mode
   =========================================== */
function initThemeToggle() {
    const toggleBtns = [
        document.getElementById('themeToggle'),
        document.getElementById('themeToggleSidebar')
    ].filter(btn => btn !== null);
    
    if (toggleBtns.length === 0) return;
    
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply theme on load
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    // Toggle theme on button click
    toggleBtns.forEach(toggleBtn => {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Save preference
            const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
            
            // Add animation feedback to clicked button
            toggleBtn.style.transform = 'scale(0.8) rotate(360deg)';
            setTimeout(() => {
                toggleBtn.style.transform = '';
            }, 400);
        });
    });
}

/* ===========================================
   Navigation
   =========================================== */
/* ===========================================
   Floating Particles
   =========================================== */
function initParticles() {
    const container = document.querySelector('.particles');
    
    if (!container) return;
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const posX = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${posX}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
}

/* ===========================================
   Scroll Animations
   =========================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add staggered delay for children
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('animated');
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ===========================================
   Mobile Menu
   =========================================== */
/* ===========================================
   Smooth Scroll
   =========================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.nav-header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===========================================
   Counter Animation
   =========================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ===========================================
   Form Validation
   =========================================== */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    showError(input, 'To pole jest wymagane');
                } else if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        showError(input, 'Podaj prawidłowy adres email');
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                showSuccess(form);
            }
        });
    });
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add error
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = 'color: #ff4444; font-size: 12px; margin-top: 5px; display: block;';
    error.textContent = message;
    formGroup.appendChild(error);
    
    input.style.borderColor = '#ff4444';
    
    // Remove error on input
    input.addEventListener('input', () => {
        error.remove();
        input.style.borderColor = '';
    }, { once: true });
}

function showSuccess(form) {
    const submitBtn = form.querySelector('button[type="submit"], .btn-primary');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Wysłano! ✓';
        submitBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            form.reset();
        }, 3000);
    }
}

/* ===========================================
   Parallax Effect
   =========================================== */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (!parallaxElements.length) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

/* ===========================================
   Typing Effect
   =========================================== */
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/* ===========================================
   Image Lazy Loading
   =========================================== */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ===========================================
   Cursor Effect (Optional)
   =========================================== */
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--navy);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Hover effect on links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-outline');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

/* ===========================================
   HAOS.fm Radio Player
   =========================================== */
function initHaosRadio() {
    const playBtn = document.getElementById('haosPlayBtn');
    const volumeSlider = document.getElementById('haosVolume');
    const volumeValue = document.getElementById('volumeValue');
    const vinylDisc = document.querySelector('.vinyl-disc');
    const eqBars = document.querySelectorAll('.eq-bar');
    
    // Audio stream (placeholder - replace with actual HAOS.fm stream URL)
    const audioStream = new Audio('https://stream.haos.fm/radio'); // Example URL
    audioStream.volume = 0.7;
    
    let isPlaying = false;
    
    // Play/Pause toggle
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                audioStream.pause();
                playBtn.classList.remove('playing');
                if (vinylDisc) vinylDisc.classList.remove('playing');
                eqBars.forEach(bar => bar.style.animationPlayState = 'paused');
            } else {
                audioStream.play().catch(err => {
                    console.log('Audio play failed:', err);
                    // Fallback: still show visual effects
                });
                playBtn.classList.add('playing');
                if (vinylDisc) vinylDisc.classList.add('playing');
                eqBars.forEach(bar => bar.style.animationPlayState = 'running');
            }
            isPlaying = !isPlaying;
        });
    }
    
    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audioStream.volume = volume;
            if (volumeValue) {
                volumeValue.textContent = e.target.value + '%';
            }
        });
    }
    
    // Animate equalizer bars randomly when playing
    function animateEqualizer() {
        if (isPlaying) {
            eqBars.forEach(bar => {
                const randomHeight = Math.random() * 60 + 20;
                bar.style.height = randomHeight + 'px';
            });
        }
        requestAnimationFrame(animateEqualizer);
    }
    
    animateEqualizer();
    
    // Update now playing info (mock data - replace with actual API)
    const tracks = [
        { title: 'Pumping Energy', artist: 'CLUBBASSE' },
        { title: 'Deep Techno Flow', artist: 'Arch1tect' },
        { title: 'Electronic Dreams', artist: 'HAOS Resident' },
        { title: 'Night Drive', artist: 'Various Artists' }
    ];
    
    let trackIndex = 0;
    
    function updateNowPlaying() {
        const trackTitle = document.getElementById('haosTrackTitle');
        const trackArtist = document.getElementById('haosArtist');
        
        if (trackTitle && trackArtist && isPlaying) {
            trackTitle.textContent = tracks[trackIndex].title;
            trackArtist.textContent = tracks[trackIndex].artist;
            
            trackIndex = (trackIndex + 1) % tracks.length;
        }
    }
    
    // Update track every 3 minutes (mock)
    setInterval(updateNowPlaying, 180000);
}

/* ===========================================
   Booking API Service
   =========================================== */
const BookingAPI = {
    baseURL: '/api/bookings',
    useMockData: true, // Set to false when Azure Function is deployed
    
    async getBookings() {
        try {
            if (this.useMockData) {
                // For local development, use localStorage
                const bookings = localStorage.getItem('arch1tect_bookings');
                return bookings ? JSON.parse(bookings) : [];
            }
            
            // Production: fetch from Azure Function
            const response = await fetch(this.baseURL);
            const data = await response.json();
            return data.success ? data.bookings : [];
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    },
    
    async createBooking(bookingData) {
        try {
            if (this.useMockData) {
                // For local development, use localStorage
                const bookings = await this.getBookings();
                const newBooking = {
                    id: Date.now().toString(),
                    ...bookingData,
                    createdAt: new Date().toISOString(),
                    status: 'pending'
                };
                bookings.push(newBooking);
                localStorage.setItem('arch1tect_bookings', JSON.stringify(bookings));
                return { success: true, booking: newBooking };
            }
            
            // Production: post to Azure Function
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, error: error.message };
        }
    },
    
    async getBookedDates() {
        try {
            if (this.useMockData) {
                const bookings = await this.getBookings();
                return bookings
                    .filter(b => b.status === 'pending' || b.status === 'confirmed')
                    .map(b => b.date);
            }
            
            // Production: fetch only dates from API
            const response = await fetch(`${this.baseURL}?datesOnly=true`);
            const data = await response.json();
            return data.success ? data.dates : [];
        } catch (error) {
            console.error('Error fetching booked dates:', error);
            return [];
        }
    }
};

/* ===========================================
   Calendar Generator with Booking
   =========================================== */
function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonthTitle = document.getElementById('calendarMonthTitle');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (!calendarDays || !calendarMonthTitle) return;
    
    let currentDate = new Date();
    let bookedDates = [];
    
    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    
    // Load booked dates
    async function loadBookedDates() {
        bookedDates = await BookingAPI.getBookedDates();
        renderCalendar(currentDate);
    }
    
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update title
        calendarMonthTitle.textContent = `${months[month]} ${year}`;
        
        // Get first day of month (0 = Sunday, 1 = Monday, etc.)
        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Make Monday = 0
        
        // Get last day of month
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        // Get last day of previous month
        const prevLastDate = new Date(year, month, 0).getDate();
        
        // Clear calendar
        calendarDays.innerHTML = '';
        
        // Previous month days
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const dayDiv = createDayElement(prevLastDate - i, true, false, false, false, '');
            calendarDays.appendChild(dayDiv);
        }
        
        // Current month days
        const today = new Date();
        for (let day = 1; day <= lastDate; day++) {
            const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayDate = new Date(year, month, day);
            const dayOfWeek = dayDate.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
            const isBooked = bookedDates.includes(currentDateStr);
            
            const dayDiv = createDayElement(day, false, isWeekend, isToday, isBooked, currentDateStr);
            calendarDays.appendChild(dayDiv);
        }
        
        // Next month days
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells; // 6 rows * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayDiv = createDayElement(day, true, false, false, false, '');
            calendarDays.appendChild(dayDiv);
        }
    }
    
    function createDayElement(day, isOtherMonth, isWeekend, isToday = false, isBooked = false, dateStr = '') {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        if (isOtherMonth) {
            dayDiv.classList.add('other-month');
        }
        
        if (isWeekend) {
            dayDiv.classList.add('weekend');
        } else {
            dayDiv.classList.add('weekday');
        }
        
        if (isToday) {
            dayDiv.classList.add('today');
        }
        
        if (isBooked) {
            dayDiv.classList.add('booked');
        }
        
        const dayNumber = document.createElement('span');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        
        dayDiv.appendChild(dayNumber);
        
        // Add click handler for available days
        if (!isOtherMonth && !isBooked) {
            dayDiv.style.cursor = 'pointer';
            dayDiv.addEventListener('click', () => {
                openBookingModal(dateStr);
            });
        }
        
        return dayDiv;
    }
    
    // Event listeners
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Initial render
    loadBookedDates();
}

/* ===========================================
   Booking Modal
   =========================================== */
function initBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.getElementById('closeBookingModal');
    const cancelBtn = document.getElementById('cancelBooking');
    const form = document.getElementById('bookingForm');
    const successDiv = document.getElementById('bookingSuccess');
    
    if (!modal || !form) return;
    
    // Close modal handlers
    const closeModal = () => {
        modal.classList.remove('active');
        form.reset();
        form.style.display = 'flex';
        successDiv.style.display = 'none';
        document.body.style.overflow = '';
    };
    
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const bookingData = {
            date: modal.dataset.selectedDate,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            eventType: formData.get('eventType'),
            venue: formData.get('venue'),
            message: formData.get('message')
        };
        
        // Submit to API
        const result = await BookingAPI.createBooking(bookingData);
        
        if (result.success) {
            // Show success message
            form.style.display = 'none';
            successDiv.style.display = 'block';
            
            // Reload calendar to show new booking
            setTimeout(() => {
                closeModal();
                if (window.initCalendar) {
                    const calendarDays = document.getElementById('calendarDays');
                    if (calendarDays) {
                        initCalendar();
                    }
                }
            }, 3000);
        } else {
            alert('Błąd podczas rezerwacji. Spróbuj ponownie.');
        }
    });
}

function openBookingModal(dateStr) {
    const modal = document.getElementById('bookingModal');
    const dateDisplay = document.getElementById('bookingModalDate');
    
    if (!modal || !dateStr) return;
    
    // Format date for display
    const [year, month, day] = dateStr.split('-');
    const months = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];
    const monthName = months[parseInt(month) - 1];
    
    dateDisplay.textContent = `Data: ${day} ${monthName} ${year}`;
    modal.dataset.selectedDate = dateStr;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/* ===========================================
   Console Easter Egg
   =========================================== */
console.log('%c ARCH1TECT ', 'background: #DC143C; color: #ffffff; font-size: 24px; font-weight: bold; padding: 10px 20px;');
console.log('%c DARKNESS • POWER • TECHNO ', 'color: #C0C0C0; font-style: italic; font-size: 14px;');
