// Initialize Theme on Page Load
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Initialize Lucide Icons
lucide.createIcons();

// Animation Observer for Scroll Reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-on-scroll').forEach(section => {
    observer.observe(section);
});


// Mobile Menu Logic
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
let isMenuOpen = false;

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Theme Toggle Logic
const toggleBtns = [
    document.getElementById('theme-toggle-desktop'),
    document.getElementById('theme-toggle-mobile')
];

toggleBtns.forEach(btn => {
    if(btn) {
        btn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.theme = 'light';
            } else {
                document.documentElement.classList.add('dark');
                localStorage.theme = 'dark';
            }
        });
    }
});

// Carousel Logic
const cards = ['card-1', 'card-2', 'card-3'];
const positionClasses = ['card-pos-center', 'card-pos-right', 'card-pos-left'];
let currentIndex = 0;

function rotateCarousel() {
    cards.forEach((cardId, index) => {
        const card = document.getElementById(cardId);
        if (card) {
            // Determine position based on currentIndex
            const posIndex = (index + currentIndex) % 3;

            // Reset classes then add standard + position class
            card.className = `code-card ${positionClasses[posIndex]}`;
        }
    });
    currentIndex = (currentIndex + 1) % 3;
}

// Start Carousel Interval
setInterval(rotateCarousel, 4000);

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
