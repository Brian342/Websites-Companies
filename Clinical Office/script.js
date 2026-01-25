/* ========================================
   CLINICAL OFFICE - JAVASCRIPT
   ======================================== */

/* ========================================
   DARK MODE TOGGLE
   ======================================== */

// Initialize dark mode from localStorage
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode || (!localStorage.getItem('darkMode') && prefersDark)) {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateThemeIcon();
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const isDark = document.body.classList.contains('dark-mode');
    
    themeToggles.forEach(toggle => {
        const icon = toggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    });
}

// Theme toggle button listeners
document.querySelectorAll('.theme-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});

/* ========================================
   NAVIGATION TOGGLE
   ======================================== */

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
    }
});

/* ========================================
   ACTIVE NAV LINK
   ======================================== */

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Set active link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

/* ========================================
   APPOINTMENT FORM VALIDATION & HANDLING
   ======================================== */

const appointmentForm = document.getElementById('appointmentForm');

if (appointmentForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateAppointmentForm()) {
            submitAppointmentForm();
        }
    });

    // Real-time validation
    const inputs = appointmentForm.querySelectorAll('input[required], textarea[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        input.addEventListener('change', () => {
            validateField(input);
        });
    });
}

function validateField(field) {
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);
    let isValid = true;
    let errorMessage = '';

    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel') {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
        if (field.value && !phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    } else if (field.id === 'appointmentDate') {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            errorMessage = 'Please select a future date';
        }
    }

    if (errorElement) {
        if (isValid) {
            errorElement.textContent = '';
            field.classList.remove('invalid');
        } else {
            errorElement.textContent = errorMessage;
            field.classList.add('invalid');
        }
    }

    return isValid;
}

function validateAppointmentForm() {
    let isValid = true;
    const requiredFields = appointmentForm.querySelectorAll('input[required], textarea[required], select[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate consent checkbox
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox && !consentCheckbox.checked) {
        const errorElement = document.getElementById('consent-error');
        if (errorElement) {
            errorElement.textContent = 'You must agree to the terms and conditions';
        }
        isValid = false;
    }

    return isValid;
}

function submitAppointmentForm() {
    // Get form data
    const formData = new FormData(appointmentForm);
    const appointmentData = Object.fromEntries(formData);
    
    // Log form data (in production, send to server)
    console.log('Appointment Form Submitted:', appointmentData);
    
    // Save to localStorage for demo purposes
    localStorage.setItem('lastAppointment', JSON.stringify(appointmentData));
    
    // Show success message
    appointmentForm.style.display = 'none';
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Send email notification (simulated)
    sendAppointmentConfirmation(appointmentData);
}

function sendAppointmentConfirmation(data) {
    // In a real application, this would send an email via a backend service
    console.log('Sending confirmation email to:', data.email);
    
    // Simulate email sending with a delay
    setTimeout(() => {
        console.log('✓ Confirmation email sent successfully');
    }, 500);
}

/* ========================================
   CONTACT FORM VALIDATION & HANDLING
   ======================================== */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm();
        }
    });

    const contactInputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    contactInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateContactField(input);
        });
    });
}

function validateContactField(field) {
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Update field styling
    if (isValid) {
        field.classList.remove('invalid');
    } else {
        field.classList.add('invalid');
    }

    return isValid;
}

function validateContactForm() {
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    
    requiredFields.forEach(field => {
        if (!validateContactField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitContactForm() {
    const formData = new FormData(contactForm);
    const contactData = Object.fromEntries(formData);
    
    console.log('Contact Form Submitted:', contactData);
    localStorage.setItem('lastContact', JSON.stringify(contactData));
    
    // Show success message
    contactForm.style.display = 'none';
    const successMessage = document.getElementById('contactSuccess');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Simulate email sending
    sendContactConfirmation(contactData);
}

function sendContactConfirmation(data) {
    console.log('Sending contact confirmation to:', data.email);
    setTimeout(() => {
        console.log('✓ Contact confirmation email sent');
    }, 500);
}

/* ========================================
   FORM STYLING FOR INVALID FIELDS
   ======================================== */

const style = document.createElement('style');
style.textContent = `
    input.invalid,
    textarea.invalid,
    select.invalid {
        border-color: #dc3545 !important;
        background-color: rgba(220, 53, 69, 0.05);
    }
    
    input.invalid:focus,
    textarea.invalid:focus,
    select.invalid:focus {
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(style);

/* ========================================
   SMOOTH SCROLL ANCHOR LINKS
   ======================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

/* ========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ======================================== */

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation classes as elements come into view
                if (entry.target.classList.contains('stat-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-in-out forwards';
                }
                if (entry.target.classList.contains('service-preview-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-in-out forwards';
                }
                if (entry.target.classList.contains('approach-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-in-out forwards';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.stat-card, .service-preview-card, .approach-card').forEach(el => {
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initIntersectionObserver);

/* ========================================
   STICKY NAVIGATION EFFECT
   ======================================== */

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (navbar) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add subtle shadow when scrolled
        if (scrollTop > 10) {
            navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
        }
        
        lastScrollTop = scrollTop;
    }
});

/* ========================================
   TOOLTIP FUNCTIONALITY
   ======================================== */

document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.getAttribute('data-tooltip');
        tooltip.style.cssText = `
            position: absolute;
            background: var(--text-dark);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    });

    element.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
});

/* ========================================
   SERVICE CARD EXPANSION
   ======================================== */

document.querySelectorAll('.service-detail-card').forEach(card => {
    const summary = card.querySelector('h3');
    if (summary) {
        summary.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    }
});

/* ========================================
   PHONE NUMBER FORMATTING
   ======================================== */

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('254')) {
            value = '+' + value;
        } else if (value.length > 9) {
            value = '+254' + value.slice(-9);
        }
    }
    
    input.value = value;
}

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => formatPhoneNumber(input));
});

/* ========================================
   PRINT FUNCTIONALITY
   ======================================== */

function printPage() {
    window.print();
}

/* ========================================
   KEYBOARD SHORTCUTS
   ======================================== */

document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }

    // Press 'Home' to scroll to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Press 'End' to scroll to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
});

/* ========================================
   SCROLL TO TOP BUTTON
   ======================================== */

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    transition: all 0.3s ease;
    z-index: 99;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1)';
});

/* ========================================
   LAZY LOADING IMAGES
   ======================================== */

if ('IntersectionObserver' in window) {
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

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ========================================
   SERVICE WORKER REGISTRATION (PWA)
   ======================================== */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('sw.js').then(reg => {
        //     console.log('Service Worker registered');
        // }).catch(err => {
        //     console.log('Service Worker registration failed:', err);
        // });
    });
}

/* ========================================
   INITIALIZATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    initDarkMode();
    
    // Log page analytics (in production, send to analytics service)
    console.log('Page loaded:', document.title);
    console.log('User dark mode preference:', document.body.classList.contains('dark-mode'));
});

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

// Get form data
function getFormData(formElement) {
    const formData = new FormData(formElement);
    return Object.fromEntries(formData);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
}

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage management
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
};

// Export for use in other scripts
window.clinicalOffice = {
    storage,
    isValidEmail,
    isValidPhone,
    debounce,
    getFormData
};
