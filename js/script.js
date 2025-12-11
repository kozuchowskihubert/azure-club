/* ===========================================
   CLUBBASSE - JavaScript Functions
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functions
    initNavigation();
    initParticles();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initCounters();
    initFormValidation();
    
});

/* ===========================================
   Navigation
   =========================================== */
function initNavigation() {
    const header = document.querySelector('.nav-header');
    
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

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
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu a');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

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

// Initialize HAOS Radio
document.addEventListener('DOMContentLoaded', function() {
    initHaosRadio();
});

/* ===========================================
   Console Easter Egg
   =========================================== */
console.log('%c CLUBBASSE ', 'background: #1a237e; color: #C0C0C0; font-size: 24px; font-weight: bold; padding: 10px 20px;');
console.log('%c Bo pumping to coś więcej... to styl bycia, styl życia ', 'color: #666; font-style: italic;');
console.log('%c 🎧 HAOS.fm - Electronic Vibes 24/7 ', 'background: linear-gradient(135deg, #ff006e, #8338ec); color: white; font-size: 16px; padding: 5px 15px; border-radius: 5px;');
