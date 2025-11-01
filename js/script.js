// ============================================
// CLASSE CAROUSEL MODERNE
// ============================================
class Carousel {
    constructor(carouselId, options = {}) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;
        
        this.track = this.carousel.querySelector('.carousel-track');
        this.items = this.carousel.querySelectorAll('.carousel-item');
        this.prevBtn = document.getElementById(options.prevBtnId);
        this.nextBtn = document.getElementById(options.nextBtnId);
        this.pageInfo = document.getElementById(options.pageInfoId);
        this.dotsContainer = document.getElementById(options.dotsId);
        
        this.currentIndex = 0;
        this.totalPages = this.items.length;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.updateCarousel();
        this.attachEvents();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        // Déplacer le track
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Mettre à jour les boutons
        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;
        
        // Mettre à jour l'info de page
        if (this.pageInfo) {
            this.pageInfo.textContent = `${this.currentIndex + 1} / ${this.totalPages}`;
        }
        
        // Mettre à jour les dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }
    }
    
    goToPage(index) {
        if (index >= 0 && index < this.totalPages) {
            this.currentIndex = index;
            this.updateCarousel();
        }
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
}

// ============================================
// INITIALISATION PRINCIPALE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Animation initiale du rideau
    const transitionInitial = document.querySelector('.page-transition-initial');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');

    // Fonction pour l'animation initiale du rideau
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (curtainLeft && curtainRight) {
                curtainLeft.style.transform = 'translateX(-100%)';
                curtainRight.style.transform = 'translateX(100%)';

                // Ajout de l'effet de brillance
                const shine = document.createElement('div');
                shine.classList.add('shine-effect');
                if (transitionInitial) {
                    transitionInitial.appendChild(shine);
                }
            }
            
            // Supprime l'élément après l'animation
            setTimeout(() => {
                if (transitionInitial) {
                    transitionInitial.remove();
                }
            }, 1500);
        }, 300);
    });

    // Fonction pour les transitions entre sections
    function initPageTransitions() {
        const transition = document.querySelector('.page-transition');
        if (!transition) return { startTransition: () => {}, endTransition: () => {} };
        
        const panels = {
            left: transition.querySelector('.transition-panel.left'),
            right: transition.querySelector('.transition-panel.right')
        };

        function startTransition() {
            transition.style.visibility = 'visible';
            if (panels.left) panels.left.style.transform = 'translateX(0)';
            if (panels.right) panels.right.style.transform = 'translateX(0)';
        }

        function endTransition() {
            if (panels.left) panels.left.style.transform = 'translateX(-100%)';
            if (panels.right) panels.right.style.transform = 'translateX(100%)';
            setTimeout(() => {
                transition.style.visibility = 'hidden';
            }, 600);
        }

        return { startTransition, endTransition };
    }

    // ============================================
    // ANIMATIONS PAR SECTION
    // ============================================
    function initSectionAnimations(sectionName) {
        if (typeof gsap === 'undefined') return;

        switch(sectionName) {
            case 'hero':
                const heroTl = gsap.timeline({ delay: 0.2 });
                
                // Animation du hero moderne
                if (document.querySelector('.hero-eyebrow')) {
                    heroTl.from('.hero-eyebrow', {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                }
                
                if (document.querySelector('.hero-title')) {
                    heroTl.from('.hero-title', {
                        duration: 1,
                        y: 50,
                        opacity: 0,
                        ease: 'power3.out'
                    }, '-=0.4');
                }
                
                if (document.querySelector('.hero-description')) {
                    heroTl.from('.hero-description', {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        ease: 'power3.out'
                    }, '-=0.6');
                }
                
                if (document.querySelector('.cta-group')) {
                    heroTl.from('.cta-group .btn', {
                        duration: 0.8,
                        y: 20,
                        opacity: 0,
                        stagger: 0.2,
                        ease: 'back.out(1.7)'
                    }, '-=0.4');
                }
                
                // Mouse follow effect
                const cursor = document.querySelector('.mouse-follow-overlay');
                if (cursor) {
                    window.addEventListener('mousemove', (e) => {
                        const x = e.clientX;
                        const y = e.clientY;
                        cursor.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent 80%)`;
                    });
                }
                break;

            case 'apropos':
                gsap.from('.about-text', {
                    scrollTrigger: {
                        trigger: '.about-text',
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    duration: 1,
                    y: 50,
                    opacity: 0,
                    ease: 'power3.out'
                });

                gsap.from('.about-details', {
                    scrollTrigger: {
                        trigger: '.about-details',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    ease: 'power3.out'
                });
                break;

            case 'competences':
                gsap.from('.skills-grid .skill-card', {
                    scrollTrigger: {
                        trigger: '.skills-grid',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
                break;

            case 'experiences':
                // Initialiser le carousel expériences
                setTimeout(() => {
                    new Carousel('experiencesCarousel', {
                        prevBtnId: 'experiencesPrev',
                        nextBtnId: 'experiencesNext',
                        pageInfoId: 'experiencesPageInfo',
                        dotsId: 'experiencesDots'
                    });
                }, 100);

                // Animation des cartes
                gsap.from('.experience-card', {
                    scrollTrigger: {
                        trigger: '.carousel-container',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
                break;

            case 'projects':
                // Initialiser le carousel projets
                setTimeout(() => {
                    new Carousel('projectsCarousel', {
                        prevBtnId: 'projectsPrev',
                        nextBtnId: 'projectsNext',
                        pageInfoId: 'projectsPageInfo',
                        dotsId: 'projectsDots'
                    });
                }, 100);

                // Animation des cartes
                gsap.from('.project-card', {
                    scrollTrigger: {
                        trigger: '.projects-grid',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
                break;

            case 'passions':
                gsap.from('.passion-card', {
                    scrollTrigger: {
                        trigger: '.passions-grid',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    scale: 0.95,
                    opacity: 0,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
                break;

            case 'contact':
                gsap.from('.contact-text', {
                    scrollTrigger: {
                        trigger: '.section-contact',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    ease: 'power3.out'
                });

                gsap.from('.contact-email', {
                    scrollTrigger: {
                        trigger: '.contact-details',
                        start: 'top 85%'
                    },
                    duration: 0.6,
                    y: 20,
                    opacity: 0,
                    ease: 'back.out(1.7)'
                });
                break;

            default:
                // Animations par défaut pour toutes les sections
                const sectionTitle = document.querySelector('.section-title');
                if (sectionTitle) {
                    gsap.from(sectionTitle, {
                        scrollTrigger: {
                            trigger: sectionTitle,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        },
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                }
                break;
        }
    }

    // Écouter l'événement de chargement de section
    document.addEventListener('section:loaded', (e) => {
        const sectionName = e.detail.name;
        console.log('🎯 Section chargée:', sectionName);
        initSectionAnimations(sectionName);
    });

    // ============================================
    // ANIMATION DE LA NAVIGATION
    // ============================================
    if (typeof gsap !== 'undefined') {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const navTl = gsap.timeline({ delay: 0.5 });
            
            navTl
                .from('.navbar', {
                    duration: 0.8,
                    y: -100,
                    opacity: 0,
                    ease: 'power4.out'
                })
                .from('.nav-menu li', {
                    duration: 0.5,
                    y: -20,
                    opacity: 0,
                    stagger: 0.1,
                    ease: 'back.out(1.7)'
                }, '-=0.3');
        }

        // Effet de scroll sur la navbar
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;
            
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ============================================
    // NAVIGATION HAMBURGER (MOBILE)
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fermer le menu lors du clic sur un lien
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================
    // TRANSITIONS DE PAGES
    // ============================================
    const pageTransitions = initPageTransitions();

    // Listen for navigation events
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('data-section');
            if (target) {
                e.preventDefault();
                pageTransitions.startTransition();
                setTimeout(() => {
                    window.location.hash = link.getAttribute('href');
                    pageTransitions.endTransition();
                }, 600);
            }
        });
    });

    // ============================================
    // NAVIGATION CLAVIER GLOBALE
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Échap pour fermer le menu mobile
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ============================================
    // SMOOTH SCROLL POUR LES ANCRES
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !this.hasAttribute('data-section')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER POUR LES ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe .scroll-reveal
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    console.log('✅ Script initialisé avec succès');
});