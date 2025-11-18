// ============================================
// SCRIPT.JS - VERSION ULTRA-OPTIMISÉE FINALE
// Compatible: Chrome, Safari, Firefox, Edge
// Performance: 60 FPS garantis
// ============================================

// ============================================
// DÉTECTION NAVIGATEUR
// ============================================
const Browser = {
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isFirefox: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    isEdge: /Edg/.test(navigator.userAgent),
    isChrome: /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent),
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/.test(navigator.userAgent)
};

console.log('🌐 Navigateur:', 
    Browser.isSafari ? 'Safari' : 
    Browser.isFirefox ? 'Firefox' : 
    Browser.isEdge ? 'Edge' : 'Chrome'
);

// ============================================
// UTILITAIRES PERFORMANCE
// ============================================
function debounce(func, wait = 150) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttleRAF(func) {
    let ticking = false;
    return function(...args) {
        if (!ticking) {
            requestAnimationFrame(() => {
                func.apply(this, args);
                ticking = false;
            });
            ticking = true;
        }
    };
}

// ============================================
// CAROUSEL 3D SEKAI - ULTRA-OPTIMISÉ
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
        
        // ⚡ CRITIQUE: Gestion visibilité
        this.isVisible = false;
        this.visibilityObserver = null;
        
        if (this.carousel && this.rotation && this.items.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('🎪 Carousel initialisé avec', this.items.length, 'items');
        this.setupVisibilityObserver();
        this.setupControls();
        this.setupDragInteraction();
        this.addDragIndicator();
        
        if (this.isVisible) {
            this.animate();
        }
    }
    
    setupVisibilityObserver() {
        if (!('IntersectionObserver' in window)) {
            this.isVisible = true;
            return;
        }
        
        this.visibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    this.isVisible = entry.isIntersecting;
                    
                    if (this.isVisible && !this.animationFrame) {
                        console.log('▶️ Carousel visible - Animation démarrée');
                        this.animate();
                    } else if (!this.isVisible && this.animationFrame) {
                        console.log('⏸️ Carousel invisible - Animation pausée');
                        cancelAnimationFrame(this.animationFrame);
                        this.animationFrame = null;
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        this.visibilityObserver.observe(this.carousel);
    }
    
    addDragIndicator() {
        if (this.carousel.querySelector('.rotation-indicator')) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'rotation-indicator';
        indicator.textContent = 'Glissez pour explorer';
        this.carousel.appendChild(indicator);
        
        setTimeout(() => {
            if (indicator.style) indicator.style.opacity = '0';
        }, 3000);
    }
    
    setupControls() {
        if (this.rightControl) {
            this.rightControl.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopAutoRotation();
                this.rotateBy(-45, 0);
                setTimeout(() => this.startAutoRotation(), 3000);
            }, { passive: false });
        }
        
        if (this.leftControl) {
            this.leftControl.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopAutoRotation();
                this.rotateBy(45, 0);
                setTimeout(() => this.startAutoRotation(), 3000);
            }, { passive: false });
        }
    }
    
    setupDragInteraction() {
        this.carousel.addEventListener('mousedown', (e) => this.onDragStart(e), { passive: true });
        document.addEventListener('mousemove', (e) => this.onDragMove(e), { passive: true });
        document.addEventListener('mouseup', () => this.onDragEnd(), { passive: true });
        
        this.carousel.addEventListener('touchstart', (e) => {
            this.onDragStart(e.touches[0]);
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                this.onDragMove(e.touches[0]);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => this.onDragEnd(), { passive: true });
        
        this.carousel.addEventListener('selectstart', (e) => e.preventDefault());
        this.carousel.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    onDragStart(e) {
        this.isDragging = true;
        this.startX = e.clientX || e.pageX;
        this.startY = e.clientY || e.pageY;
        this.startRotationY = this.currentRotationY;
        this.startRotationX = this.currentRotationX;
        this.stopAutoRotation();
        this.carousel.classList.add('dragging');
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        
        const clientX = e.clientX || e.pageX;
        const clientY = e.clientY || e.pageY;
        
        const deltaX = clientX - this.startX;
        const rotationChangeY = deltaX * 0.2;
        this.targetRotationY = this.startRotationY + rotationChangeY;
        
        const deltaY = clientY - this.startY;
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
        if (!this.isVisible) {
            this.animationFrame = null;
            return;
        }
        
        if (this.isAutoRotating && !this.isDragging) {
            this.targetRotationY += this.autoRotateSpeed;
        }
        
        const diffY = this.targetRotationY - this.currentRotationY;
        const diffX = this.targetRotationX - this.currentRotationX;
        
        // Arrêt si pas de mouvement
        if (Math.abs(diffY) < 0.001 && Math.abs(diffX) < 0.001 && !this.isAutoRotating) {
            this.currentRotationY = this.targetRotationY;
            this.currentRotationX = this.targetRotationX;
            this.updateTransform();
            return;
        }
        
        this.currentRotationY += diffY * 0.08;
        this.currentRotationX += diffX * 0.08;
        
        this.updateTransform();
        this.updateFrontCards();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateTransform() {
        if (!this.rotation) return;
        
        const transform = `rotateX(${this.currentRotationX}deg) rotateY(${this.currentRotationY}deg) translateZ(0)`;
        this.rotation.style.transform = transform;
        
        if (Browser.isSafari || Browser.isEdge) {
            this.rotation.style.webkitTransform = transform;
        }
    }
    
    updateFrontCards() {
        const normalizedRotation = ((this.currentRotationY % 360) + 360) % 360;
        const totalCards = this.items.length;
        const degreesPerCard = 360 / totalCards;
        const frontCardIndex = Math.round((360 - normalizedRotation) / degreesPerCard) % totalCards;
        
        requestAnimationFrame(() => {
            this.items.forEach((item, index) => {
                item.classList.toggle('is-front', index === frontCardIndex);
            });
        });
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.visibilityObserver) {
            this.visibilityObserver.disconnect();
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
        console.log('💼 Carousel expériences initialisé');
        this.createDots();
        this.updateCarousel();
        this.attachEvents();
        this.setupSwipeGestures();
        this.setupKeyboardNavigation();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i), { passive: true });
            fragment.appendChild(dot);
        }
        
        this.dotsContainer.appendChild(fragment);
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        const offset = -this.currentIndex * 100;
        const transform = `translateX(${offset}%) translateZ(0)`;
        
        this.track.style.willChange = 'transform';
        this.track.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        this.track.style.transform = transform;
        
        if (Browser.isSafari || Browser.isEdge) {
            this.track.style.webkitTransform = transform;
        }
        
        setTimeout(() => {
            this.track.style.willChange = 'auto';
        }, 600);
        
        if (this.pageInfo) {
            this.pageInfo.textContent = `${this.currentIndex + 1} / ${this.totalPages}`;
        }
        
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
        
        setTimeout(() => this.animateCurrentPageCards(), 100);
    }
    
    animateCurrentPageCards() {
        const currentPage = this.items[this.currentIndex];
        if (!currentPage) return;
        
        const cards = currentPage.querySelectorAll('.experience-card');
        
        requestAnimationFrame(() => {
            cards.forEach((card, index) => {
                card.style.willChange = 'opacity, transform';
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) translateZ(0)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) translateZ(0)';
                    
                    setTimeout(() => {
                        card.style.willChange = 'auto';
                    }, 600);
                }, 100 + index * 150);
            });
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
        setTimeout(() => { this.isTransitioning = false; }, 600);
    }
    
    prev() { this.goToPage(this.currentIndex - 1); }
    next() { this.goToPage(this.currentIndex + 1); }
    
    attachEvents() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev(), { passive: true });
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next(), { passive: true });
    }
    
    setupSwipeGestures() {
        let startX = 0, startY = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = Math.abs(startY - endY);
            
            if (Math.abs(diffX) > 50 && diffY < 30) {
                diffX > 0 ? this.next() : this.prev();
            }
        }, { passive: true });
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
    console.log('🍔 Menu hamburger');
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navToggle || !navMenu || !navOverlay) {
        console.error('❌ Éléments navigation manquants');
        return;
    }
    
    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    function toggleMenu(e) {
        if (e) e.preventDefault();
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            navToggle.classList.add('active');
            navMenu.classList.add('active');
            navOverlay.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }
    
    navToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMenu();
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });
}

// ============================================
// SCROLL NAVIGATION
// ============================================
function initScrollNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const handleScroll = throttleRAF(() => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 100);
    });
    
    window.addEventListener('scroll', handleScroll, { passive: true });
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
            curtainLeft.style.willChange = 'transform';
            curtainRight.style.willChange = 'transform';
            
            const transform = 'translateX(-100%) translateZ(0)';
            curtainLeft.style.transform = transform;
            curtainRight.style.transform = transform.replace('-100%', '100%');
            
            if (Browser.isSafari) {
                curtainLeft.style.webkitTransform = transform;
                curtainRight.style.webkitTransform = transform.replace('-100%', '100%');
            }
            
            setTimeout(() => {
                curtainLeft.style.willChange = 'auto';
                curtainRight.style.willChange = 'auto';
            }, 1200);
            
            const delays = [[heroTitle, 300], [heroSubtitle, 600], [ctaButton, 900]];
            delays.forEach(([el, delay]) => {
                if (el) {
                    setTimeout(() => {
                        el.style.willChange = 'opacity, transform';
                        el.classList.add('animate-in');
                        setTimeout(() => {
                            el.style.willChange = 'auto';
                        }, 1000);
                    }, delay);
                }
            });
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
    
    console.log('✅ GSAP chargé');
    gsap.registerPlugin(ScrollTrigger);
    
    if (Browser.isSafari) {
        ScrollTrigger.config({
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
            ignoreMobileResize: true,
            limitCallbacks: true
        });
    }
    
    ScrollTrigger.normalizeScroll(true);
    setTimeout(() => ScrollTrigger.refresh(), 100);
    
    const commonConfig = {
        scrollTrigger: {
            toggleActions: 'play none none reverse',
            once: false,
            fastScrollEnd: true,
            preventOverlaps: true
        },
        ease: 'power2.out',
        duration: 0.8,
        force3D: true
    };
    
    // À propos
    gsap.fromTo('.apropos-text',
        { y: 40, opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.section-apropos', start: 'top 75%' }, y: 0, opacity: 1 }
    );
    
    gsap.fromTo('.stat-card',
        { y: 30, opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.stats-grid', start: 'top 80%' }, y: 0, opacity: 1, stagger: 0.1 }
    );
    
    // Carousel 3D
    gsap.fromTo('.carousel-3d',
        { scale: 0.9, opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.section-competences', start: 'top 70%' }, duration: 1, scale: 1, opacity: 1 }
    );
    
    // Expériences
    gsap.fromTo('.section-header',
        { y: 25, opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.section-experiences', start: 'top 75%' }, y: 0, opacity: 1 }
    );
    
    // Frameworks
    gsap.fromTo('.frameworks-track',
        { opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.section-frameworks', start: 'top 80%' }, duration: 0.6, opacity: 1 }
    );
    
    // Projets, Formations, Passions
    const cardSections = [
        { selector: '.projet-card', trigger: '.section-projets' },
        { selector: '.formation-item', trigger: '.section-formations' },
        { selector: '.passion-visual-card', trigger: '.section-passions' }
    ];
    
    cardSections.forEach(config => {
        const cards = document.querySelectorAll(config.selector);
        if (cards.length > 0) {
            gsap.fromTo(cards,
                { y: 40, opacity: 0 },
                { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: config.trigger, start: 'top 75%' }, y: 0, opacity: 1, stagger: 0.12 }
            );
        }
    });
    
    // Contact
    gsap.fromTo('.contact-text',
        { y: 35, opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.section-contact', start: 'top 75%' }, y: 0, opacity: 1 }
    );
    
    gsap.fromTo('.contact-btn',
        { y: 25, opacity: 0 },
        { ...commonConfig, scrollTrigger: { ...commonConfig.scrollTrigger, trigger: '.contact-links', start: 'top 80%' }, y: 0, opacity: 1, stagger: 0.1 }
    );
}

// ============================================
// PARALLAXE HERO
// ============================================
function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    let ticking = false;
    
    const handleParallax = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (scrolled > window.innerHeight * 0.5) {
                    ticking = false;
                    return;
                }
                
                const parallax = scrolled * 0.25;
                const transform = `translateY(${parallax}px) translateZ(0)`;
                
                heroContent.style.transform = transform;
                if (Browser.isSafari) heroContent.style.webkitTransform = transform;
                
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleParallax, { passive: true });
}

// ============================================
// INITIALISATION
// ============================================
let sekaiCarousel = null;
let experienceCarousel = null;
let initialized = false;

function initializeEverything() {
    if (initialized) return;
    initialized = true;
    
    console.log('🚀 Initialisation complète');
    
    initMobileNavigation();
    initScrollNavigation();
    
    if (!document.body.classList.contains('curtain-animation-done')) {
        initCurtainAndHeroAnimation();
    }
    
    if (typeof gsap !== 'undefined') {
        initGSAPAnimations();
    }
    
    initHeroParallax();
    
    if (document.querySelector('.carousel-track') && !experienceCarousel) {
        experienceCarousel = new ExperienceCarousel();
    }
    
    if (document.querySelector('.carousel-3d') && !sekaiCarousel) {
        sekaiCarousel = new SekaiCarousel3D();
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('✨ Initialisation terminée');
}

// Événements
document.addEventListener('sectionsLoaded', () => {
    setTimeout(initializeEverything, 200);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!initialized) initializeEverything();
    }, 500);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        if (!initialized) initializeEverything();
    }, 1000);
});

// Cleanup
window.addEventListener('beforeunload', () => {
    if (sekaiCarousel) sekaiCarousel.destroy();
    console.log('🧹 Cleanup effectué');
});

// Resize
const handleResize = debounce(() => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 250);

window.addEventListener('resize', handleResize, { passive: true });

// Visibilité page
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (sekaiCarousel && sekaiCarousel.animationFrame) {
            cancelAnimationFrame(sekaiCarousel.animationFrame);
            sekaiCarousel.animationFrame = null;
        }
    } else {
        if (sekaiCarousel && sekaiCarousel.isVisible && !sekaiCarousel.animationFrame) {
            sekaiCarousel.animate();
        }
    }
});

console.log('✨ Script optimisé chargé');