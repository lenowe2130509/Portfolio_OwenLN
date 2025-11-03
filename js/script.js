// ============================================
// PORTFOLIO OWEN LE NADANT - SCRIPT PRINCIPAL
// ============================================

// ============================================
// CAROUSEL 3D SEKAI STYLE
// ============================================

class SekaiCarousel3D {
    constructor() {
        this.carousel = document.querySelector('.carousel-3d');
        this.rotation = document.querySelector('.carousel-rotation');
        this.items = document.querySelectorAll('.carousel-item');
        this.leftControl = document.querySelector('.carousel-control.left');
        this.rightControl = document.querySelector('.carousel-control.right');
        
        this.currentRotationY = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.targetRotationX = 0;
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.startRotationY = 0;
        this.startRotationX = 0;
        
        this.autoRotateSpeed = -0.08;
        this.isAutoRotating = true;
        this.animationFrame = null;
        
        if (this.carousel && this.rotation && this.items.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎪 Carousel Sekai initialisé avec', this.items.length, 'items');
        this.setupControls();
        this.setupDragInteraction();
        this.addDragIndicator();
        this.animate();
    }
    
    addDragIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'rotation-indicator';
        indicator.textContent = 'Glissez pour explorer';
        this.carousel.appendChild(indicator);
    }
    
    setupControls() {
        if (this.rightControl) {
            this.rightControl.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopAutoRotation();
                this.rotateBy(-45, 0);
                setTimeout(() => this.startAutoRotation(), 3000);
            });
        }
        
        if (this.leftControl) {
            this.leftControl.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopAutoRotation();
                this.rotateBy(45, 0);
                setTimeout(() => this.startAutoRotation(), 3000);
            });
        }
    }
    
    setupDragInteraction() {
        this.carousel.addEventListener('mousedown', (e) => this.onDragStart(e));
        document.addEventListener('mousemove', (e) => this.onDragMove(e));
        document.addEventListener('mouseup', () => this.onDragEnd());
        
        this.carousel.addEventListener('touchstart', (e) => this.onDragStart(e.touches[0]));
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.onDragMove(e.touches[0]);
            }
        }, { passive: false });
        document.addEventListener('touchend', () => this.onDragEnd());
        
        this.carousel.addEventListener('selectstart', (e) => e.preventDefault());
    }
    
    onDragStart(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startRotationY = this.currentRotationY;
        this.startRotationX = this.currentRotationX;
        this.stopAutoRotation();
        this.carousel.classList.add('dragging');
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.startX;
        const rotationChangeY = deltaX * 0.2;
        this.targetRotationY = this.startRotationY + rotationChangeY;
        
        const deltaY = e.clientY - this.startY;
        const rotationChangeX = deltaY * 0.15;
        this.targetRotationX = this.startRotationX - rotationChangeX;
        this.targetRotationX = Math.max(-30, Math.min(30, this.targetRotationX));
    }
    
    onDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.carousel.classList.remove('dragging');
        this.targetRotationX = 0;
        setTimeout(() => this.startAutoRotation(), 2000);
    }
    
    rotateBy(degreesY, degreesX) {
        this.targetRotationY += degreesY;
        this.targetRotationX += degreesX;
    }
    
    startAutoRotation() {
        this.isAutoRotating = true;
    }
    
    stopAutoRotation() {
        this.isAutoRotating = false;
    }
    
    animate() {
        if (this.isAutoRotating && !this.isDragging) {
            this.targetRotationY += this.autoRotateSpeed;
        }
        
        const diffY = this.targetRotationY - this.currentRotationY;
        const diffX = this.targetRotationX - this.currentRotationX;
        
        this.currentRotationY += diffY * 0.08;
        this.currentRotationX += diffX * 0.08;
        
        if (this.rotation) {
            this.rotation.style.transform = `rotateX(${this.currentRotationX}deg) rotateY(${this.currentRotationY}deg)`;
        }
        
        this.updateFrontCards();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateFrontCards() {
        const normalizedRotation = ((this.currentRotationY % 360) + 360) % 360;
        const totalCards = this.items.length;
        const degreesPerCard = 360 / totalCards;
        let frontCardIndex = Math.round((360 - normalizedRotation) / degreesPerCard) % totalCards;
        
        this.items.forEach((item, index) => {
            if (index === frontCardIndex) {
                item.classList.add('is-front');
            } else {
                item.classList.remove('is-front');
            }
        });
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// ============================================
// CAROUSEL EXPÉRIENCES
// ============================================

class ExperienceCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.items = document.querySelectorAll('.carousel-item-exp');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInfo = document.getElementById('pageInfo');
        this.dotsContainer = document.getElementById('carouselDots');

        this.currentIndex = 0;
        this.totalPages = this.items.length;
        this.isTransitioning = false;

        if (this.track && this.items.length > 0) {
            this.init();
        }
    }

    init() {
        console.log('💼 Carousel expériences initialisé avec', this.totalPages, 'pages');
        this.createDots();
        this.updateCarousel();
        this.attachEvents();
        this.setupSwipeGestures();
        this.setupKeyboardNavigation();
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateCarousel() {
        if (!this.track) return;

        const offset = -this.currentIndex * 100;
        this.track.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        this.track.style.transform = `translateX(${offset}%)`;

        if (this.pageInfo) {
            this.pageInfo.textContent = `${this.currentIndex + 1} / ${this.totalPages}`;
        }

        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        this.animateCurrentPageCards();
    }

    animateCurrentPageCards() {
        const currentPage = this.items[this.currentIndex];
        if (!currentPage) return;

        const cards = currentPage.querySelectorAll('.experience-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 150);
        });
    }

    goToPage(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        if (index < 0) {
            this.currentIndex = this.totalPages - 1;
        } else if (index >= this.totalPages) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = index;
        }

        this.updateCarousel();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    prev() {
        this.goToPage(this.currentIndex - 1);
    }

    next() {
        this.goToPage(this.currentIndex + 1);
    }

    attachEvents() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    }

    setupSwipeGestures() {
        let startX = 0;
        this.track.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        });
        this.track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].screenX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const experiencesSection = document.querySelector('.section-experiences');
            if (!experiencesSection) return;
            const rect = experiencesSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
            if (isInView) {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    }
}

// ============================================
// NAVIGATION MOBILE
// ============================================

function initMobileNavigation() {
    console.log('🍔 Initialisation du menu hamburger...');
    
    // Attendre un peu pour être sûr que le DOM est prêt
    setTimeout(() => {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        const navLinks = document.querySelectorAll('.nav-link');
        
        console.log('🔍 navToggle:', navToggle);
        console.log('🔍 navMenu:', navMenu);
        console.log('🔍 navOverlay:', navOverlay);
        console.log('🔍 navLinks:', navLinks.length);
        
        if (!navToggle || !navMenu || !navOverlay) {
            console.error('❌ Éléments de navigation manquants');
            console.error('navToggle:', !!navToggle);
            console.error('navMenu:', !!navMenu);
            console.error('navOverlay:', !!navOverlay);
            return;
        }
        
        console.log('✅ Éléments de navigation trouvés');
        
        function openMenu() {
            console.log('📂 Ouverture du menu');
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            navOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Force l'affichage (au cas où)
            navMenu.style.transform = 'translateX(0)';
            navOverlay.style.opacity = '1';
            navOverlay.style.visibility = 'visible';
        }
        
        function closeMenu() {
            console.log('📁 Fermeture du menu');
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset les styles
            navMenu.style.transform = 'translateX(100%)';
            navOverlay.style.opacity = '0';
            navOverlay.style.visibility = 'hidden';
        }
        
        function toggleMenu(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            console.log('🖱️ Toggle menu - État actuel:', navMenu.classList.contains('active'));
            
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Event listener sur le bouton hamburger
        navToggle.addEventListener('click', toggleMenu);
        console.log('✅ Event listener ajouté sur navToggle');
        
        // Event listener sur l'overlay
        navOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Clic sur overlay');
            closeMenu();
        });
        console.log('✅ Event listener ajouté sur navOverlay');
        
        // Event listener sur les liens
        navLinks.forEach((link, index) => {
            link.addEventListener('click', () => {
                console.log(`🖱️ Clic sur lien ${index + 1}`);
                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });
        console.log('✅ Event listeners ajoutés sur', navLinks.length, 'liens');
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                console.log('⌨️ Escape pressé');
                closeMenu();
            }
        });
        
        console.log('✅ Menu hamburger complètement initialisé');
        
        // Test automatique après 1 seconde
        setTimeout(() => {
            console.log('🧪 Test automatique du menu...');
            const rect = navToggle.getBoundingClientRect();
            console.log('Position du bouton:', rect);
            console.log('Largeur fenêtre:', window.innerWidth);
        }, 1000);
        
    }, 100);
}

// ============================================
// SCROLL NAVIGATION
// ============================================

function initScrollNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// ANIMATION RIDEAU + HERO
// ============================================

function initCurtainAndHeroAnimation() {
    const transitionInitial = document.querySelector('.page-transition-initial');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');

    setTimeout(() => {
        if (curtainLeft && curtainRight) {
            curtainLeft.style.transform = 'translateX(-100%)';
            curtainRight.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (heroTitle) heroTitle.classList.add('animate-in');
            }, 300);
            
            setTimeout(() => {
                if (heroSubtitle) heroSubtitle.classList.add('animate-in');
            }, 600);
            
            setTimeout(() => {
                if (ctaButton) ctaButton.classList.add('animate-in');
            }, 900);
        }
        
        setTimeout(() => {
            if (transitionInitial) transitionInitial.remove();
            document.body.classList.add('curtain-animation-done');
        }, 1200);
    }, 300);
}

// ============================================
// ANIMATIONS GSAP
// ============================================

function initGSAPAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP non chargé');
        return;
    }
    
    console.log('✅ GSAP chargé - Initialisation des animations');
    gsap.registerPlugin(ScrollTrigger);
    
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
    
    // À propos
    gsap.fromTo('.apropos-text',
        { y: 60, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.section-apropos',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 0,
            opacity: 1,
            ease: 'power3.out'
        }
    );
    
    gsap.fromTo('.stat-card',
        { y: 40, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power3.out'
        }
    );
    
    // Compétences 3D
    gsap.fromTo('.carousel-3d',
        { scale: 0.8, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.section-competences',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            duration: 1.2,
            scale: 1,
            opacity: 1,
            ease: 'power3.out'
        }
    );
    
    // Expériences
    gsap.fromTo('.section-header',
        { y: 30, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.section-experiences',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: 'power3.out'
        }
    );
    
    // Frameworks
    gsap.fromTo('.frameworks-track',
        { opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.section-frameworks',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            opacity: 1,
            ease: 'power3.out'
        }
    );
    
    // Projets
    const projetsCards = document.querySelectorAll('.projet-card');
    if (projetsCards.length > 0) {
        gsap.fromTo(projetsCards,
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.section-projets',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power3.out'
            }
        );
    }
    
    // Formations
    const formationsCards = document.querySelectorAll('.formation-item');
    if (formationsCards.length > 0) {
        gsap.fromTo(formationsCards,
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.section-formations',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power3.out'
            }
        );
    }
    
    // Passions
    const passionsCards = document.querySelectorAll('.passion-visual-card');
    if (passionsCards.length > 0) {
        gsap.fromTo(passionsCards,
            { y: 60, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.section-passions',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power3.out'
            }
        );
    }
    
    // Contact
    gsap.fromTo('.contact-text',
        { y: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.section-contact',
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            duration: 1,
            y: 0,
            opacity: 1,
            ease: 'power3.out'
        }
    );
    
    gsap.fromTo('.contact-btn',
        { y: 30, opacity: 0 },
        {
            scrollTrigger: {
                trigger: '.contact-links',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power3.out'
        }
    );
    
    console.log('✨ Animations GSAP configurées');
}

// ============================================
// PARALLAXE HERO
// ============================================

function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            heroContent.style.transform = `translateY(${parallax}px)`;
        });
    }
}

// ============================================
// CURSEUR CUSTOM (Desktop uniquement)
// ============================================

function initCustomCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid white;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 20 + 'px';
        cursor.style.top = e.clientY - 20 + 'px';
    });
    
    const clickables = document.querySelectorAll('a, button, .skill-card, .passion-visual-card, .carousel-control, .experience-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// INITIALISATION PRINCIPALE
// ============================================

let sekaiCarousel = null;
let experienceCarousel = null;
let navigationInitialized = false;

// Fonction d'initialisation complète
function initializeEverything() {
    if (navigationInitialized) {
        console.log('⚠️ Navigation déjà initialisée, skip');
        return;
    }
    
    console.log('🚀 Initialisation complète...');
    
    // Navigation (PRIORITÉ 1)
    initMobileNavigation();
    initScrollNavigation();
    navigationInitialized = true;
    
    // Animation rideau + hero
    if (!document.body.classList.contains('curtain-animation-done')) {
        initCurtainAndHeroAnimation();
    }
    
    // Animations GSAP
    initGSAPAnimations();
    
    // Parallaxe Hero
    initHeroParallax();
    
    // Curseur custom
    initCustomCursor();
    
    // Carousels
    if (document.querySelector('.carousel-track') && !experienceCarousel) {
        experienceCarousel = new ExperienceCarousel();
    }
    
    if (document.querySelector('.carousel-3d') && !sekaiCarousel) {
        sekaiCarousel = new SekaiCarousel3D();
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Méthode 1 : sectionsLoaded
document.addEventListener('sectionsLoaded', () => {
    console.log('✨ Event sectionsLoaded déclenché');
    setTimeout(initializeEverything, 200);
});

// Méthode 2 : DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ DOMContentLoaded déclenché');
    setTimeout(() => {
        if (!navigationInitialized) {
            console.log('⚠️ Navigation pas encore initialisée via sectionsLoaded');
            initializeEverything();
        }
    }, 500);
});

// Méthode 3 : window.load (dernier recours)
window.addEventListener('load', () => {
    console.log('✨ window.load déclenché');
    setTimeout(() => {
        if (!navigationInitialized) {
            console.log('⚠️ Fallback final - initialisation forcée');
            initializeEverything();
        }
    }, 1000);
});

console.log('✨ Script principal chargé');