/* script.js */

// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });
}

// Navigation active state and smooth scrolling
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
}

// Header scroll behavior
function updateHeader() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Optimized scroll handler
let ticking = false;
let scrollTopBtn = null;

function updateScrollTopBtn() {
    if (scrollTopBtn) {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
}

function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateActiveNav();
            updateHeader();
            updateScrollTopBtn();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll);

// Scroll to top button
function createScrollTopButton() {
    // Remove existing button if it exists
    const existingBtn = document.querySelector('.scroll-top');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.setAttribute('data-tooltip', 'Back to top');
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return scrollTopBtn;
}

// Initialize scroll-to-top button
createScrollTopButton();

// Loading spinner
const loader = document.createElement('div');
loader.className = 'loader';
loader.innerHTML = '<div class="loader-spinner"></div>';
document.body.prepend(loader);

// Hide loader when page is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 800);
});

// Typing animation for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when hero section is visible
const heroTitle = document.querySelector('.hero-text h1 span');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    typeWriter(heroTitle, originalText, 150);
                }, 500);
                heroObserver.unobserve(entry.target);
            }
        });
    });
    
    heroObserver.observe(heroTitle);
}

// Parallax effect for hero section
function parallaxScroll() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image img');
    
    if (hero && heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
}

window.addEventListener('scroll', parallaxScroll);

// Add floating animation to certain elements
document.addEventListener('DOMContentLoaded', () => {
    const floatingElements = document.querySelectorAll('.hero-image, .about-image');
    floatingElements.forEach(el => {
        el.classList.add('floating');
    });
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Enhanced project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add entrance animations to elements
const animatedElements = document.querySelectorAll('.card, .project-card, .timeline-item');
animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
    el.classList.add('fade-in');
});

console.log('Portfolio loaded successfully! 🚀');

// Theme Toggle - Enhanced Implementation
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('i');

// Check for saved theme preference or respect OS preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

// Initialize theme
if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Theme toggle event
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation effect
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
}

// Listen for OS theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Enhanced skill bar animation
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach((bar, index) => {
        const width = bar.parentElement.getAttribute('data-width') || bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = width;
        }, index * 100 + 200);
    });
}

// Set data-width attribute for all skill bars
document.querySelectorAll('.skill-bar').forEach(bar => {
    const progress = bar.querySelector('.skill-progress');
    if (progress && progress.style.width) {
        bar.setAttribute('data-width', progress.style.width);
    }
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate skills section
            if (entry.target.id === 'skills') {
                animateSkillBars();
            }
            
            // Add animate class to sections
            entry.target.classList.add('animate');
            
            // Animate child elements with stagger effect
            const fadeElements = entry.target.querySelectorAll('.project-card, .skill-category, .timeline-item, .contact-item');
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('fade-in', 'animate');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual implementation)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'var(--success)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                this.reset();
            }, 2000);
        }, 1500);
    });
}

// Add loading animation on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Performance optimization: Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Enhanced Email Button Interactions
function enhanceEmailButton() {
    const emailBtn = document.querySelector('.contact-actions .btn-primary');
    
    if (emailBtn) {
        // Add ripple effect on click
        emailBtn.addEventListener('click', function(e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            // Calculate position and size
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Set position and size
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            // Add to button
            this.appendChild(ripple);
            
            // Remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add loading state
            this.classList.add('loading');
            
            // Simulate email client opening delay
            setTimeout(() => {
                this.classList.remove('loading');
                this.classList.add('success');
                
                // Show success message briefly
                const originalText = this.querySelector('.btn-text').textContent;
                this.querySelector('.btn-text').textContent = 'Opening...';
                
                setTimeout(() => {
                    this.classList.remove('success');
                    this.querySelector('.btn-text').textContent = originalText;
                }, 2000);
            }, 800);
        });
        
        // Add hover sound effect (optional)
        emailBtn.addEventListener('mouseenter', function() {
            // You can add a subtle sound effect here if desired
            this.style.setProperty('--hover-intensity', '1');
        });
        
        emailBtn.addEventListener('mouseleave', function() {
            this.style.setProperty('--hover-intensity', '0');
        });
    }
}

// Initialize email button enhancements
document.addEventListener('DOMContentLoaded', enhanceEmailButton);

