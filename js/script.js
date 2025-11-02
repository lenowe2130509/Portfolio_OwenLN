// ============================================
// CAROUSEL 3D SEKAI STYLE - VERSION OPTIMISÉE
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
        this.carousel.addEventListener('mousedown', (e) => {
            this.onDragStart(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            this.onDragMove(e);
        });
        
        document.addEventListener('mouseup', () => {
            this.onDragEnd();
        });
        
        this.carousel.addEventListener('touchstart', (e) => {
            this.onDragStart(e.touches[0]);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.onDragMove(e.touches[0]);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            this.onDragEnd();
        });
        
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
        
        setTimeout(() => {
            this.startAutoRotation();
        }, 2000);
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
// CAROUSEL EXPÉRIENCES - VERSION CORRIGÉE
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
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        if (this.track && this.items.length > 0) {
            this.init();
        }
    }
    
    init() {
        console.log('✅ Carousel expériences initialisé avec', this.totalPages, 'pages');
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
            dot.setAttribute('aria-label', `Page ${i + 1}`);
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel() {
        if (this.isTransitioning) return;
        
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
        if (this.nextBtn) this.nextBtn.disabled = this.currentIndex === this.totalPages - 1;
        
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
            }, 100 + (index * 150));
        });
    }
    
    goToPage(index) {
        if (index >= 0 && index < this.totalPages && !this.isTransitioning) {
            this.isTransitioning = true;
            this.currentIndex = index;
            this.updateCarousel();
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.goToPage(this.currentIndex - 1);
        }
    }
    
    next() {
        if (this.currentIndex < this.totalPages - 1) {
            this.goToPage(this.currentIndex + 1);
        }
    }
    
    setupSwipeGestures() {
        if (!this.track) return;
        
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const experiencesSection = document.querySelector('.section-experiences');
            if (!experiencesSection) return;
            
            const rect = experiencesSection.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isInView) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            }
        });
    }
    
    attachEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
    }
}

// ============================================
// FONCTION D'INITIALISATION PRINCIPALE
// ============================================

let sekaiCarousel = null;
let experienceCarousel = null;

function initializePortfolio() {
    console.log('📄 Initialisation du portfolio...');
    
    // ============================================
    // ANIMATION DU RIDEAU
    // ============================================
    const transitionInitial = document.querySelector('.page-transition-initial');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');

    setTimeout(() => {
        if (curtainLeft && curtainRight) {
            curtainLeft.style.transform = 'translateX(-100%)';
            curtainRight.style.transform = 'translateX(100%)';
        }
        
        setTimeout(() => {
            if (transitionInitial) {
                transitionInitial.remove();
            }
            
            initGSAPAnimations();
            
        }, 1200);
    }, 300);

    // ============================================
    // FONCTION POUR INITIALISER LES ANIMATIONS GSAP
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
        
        // Hero
        gsap.fromTo('.hero-title', 
            { y: 80, opacity: 0 },
            { 
                duration: 1.2,
                y: 0,
                opacity: 1,
                ease: 'power4.out',
                delay: 0.2
            }
        );
        
        gsap.fromTo('.hero-subtitle',
            { y: 30, opacity: 0 },
            {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: 'power3.out',
                delay: 0.6
            }
        );
        
        gsap.fromTo('.cta-button',
            { y: 20, opacity: 0 },
            {
                duration: 0.8,
                y: 0,
                opacity: 1,
                ease: 'back.out(1.7)',
                delay: 1
            }
        );
        
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
        
        // Formations
        const formationsSection = document.querySelector('#formations');
        if (formationsSection) {
            const formationsCards = formationsSection.querySelectorAll('.formation-item');
            if (formationsCards.length > 0) {
                gsap.fromTo(formationsCards,
                    { y: 60, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: '#formations',
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
        }
        
        // Formations Autres
        const formationsAutresSection = document.querySelector('#formations-autres');
        if (formationsAutresSection) {
            const formationsAutresCards = formationsAutresSection.querySelectorAll('.formation-item');
            if (formationsAutresCards.length > 0) {
                gsap.fromTo(formationsAutresCards,
                    { y: 60, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: '#formations-autres',
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
        }
        
        // Passions
        const passionsSection = document.querySelector('#passions');
        if (passionsSection) {
            let passionsCards = passionsSection.querySelectorAll('.passion-visual-card');
            
            if (passionsCards.length === 0) {
                passionsCards = passionsSection.querySelectorAll('.passion-card');
            }
            
            if (passionsCards.length > 0) {
                gsap.fromTo(passionsCards,
                    { y: 60, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: '#passions',
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
        
        gsap.fromTo('.contact-content',
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.contact-content',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                ease: 'power3.out'
            }
        );
        
        console.log('✨ Toutes les animations GSAP sont configurées');
    }

    // ============================================
    // NAVIGATION SCROLL
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
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

    // ============================================
    // INITIALISATION CAROUSELS - CORRIGÉ
    // ============================================
    setTimeout(() => {
        // Carousel expériences - avec vérification multiple
        const checkAndInitExperiences = () => {
            const track = document.querySelector('.carousel-track');
            const items = document.querySelectorAll('.carousel-item-exp');
            
            if (track && items.length > 0) {
                experienceCarousel = new ExperienceCarousel();
                console.log('✅ Carousel expériences initialisé');
                return true;
            }
            return false;
        };
        
        // Essayer d'initialiser immédiatement
        if (!checkAndInitExperiences()) {
            // Si ça ne marche pas, réessayer après 500ms
            setTimeout(() => {
                if (!checkAndInitExperiences()) {
                    console.warn('⚠️ Carousel expériences non initialisé - éléments manquants');
                }
            }, 500);
        }
        
        // Carousel 3D Sekai
        const carouselElement = document.querySelector('.carousel-3d');
        if (carouselElement) {
            sekaiCarousel = new SekaiCarousel3D();
            console.log('✅ Carousel 3D Sekai initialisé');
        }
        
    }, 100);

    // ============================================
    // PARALLAXE HERO
    // ============================================
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            heroContent.style.transform = `translateY(${parallax}px)`;
            heroContent.style.opacity = 1 - (scrolled / 800);
        });
    }

    // ============================================
    // CURSEUR CUSTOM (Desktop only)
    // ============================================
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
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
    // DEBUG
    // ============================================
    console.log('✨ Portfolio Owen Le Nadant - Initialisé');
    console.log('🎪 Carousel 3D:', sekaiCarousel ? 'ACTIF ✅' : 'INACTIF ❌');
    console.log('💼 Carousel Expériences:', experienceCarousel ? 'ACTIF ✅' : 'INACTIF ❌');
}

// ============================================
// ÉCOUTER L'ÉVÉNEMENT DE CHARGEMENT DES SECTIONS
// ============================================

// Attendre que toutes les sections soient chargées
document.addEventListener('sectionsLoaded', () => {
    console.log('✨ Sections chargées - Initialisation du portfolio');
    
    // Attendre un peu pour que le DOM soit bien prêt
    setTimeout(() => {
        initializePortfolio();
    }, 200);
});

// Fallback au cas où le loader ne fonctionne pas
window.addEventListener('load', () => {
    // Si après 2 secondes le portfolio n'est pas initialisé, on force l'initialisation
    setTimeout(() => {
        if (!sekaiCarousel && !experienceCarousel) {
            console.warn('⚠️ Initialisation de secours...');
            initializePortfolio();
        }
    }, 2000);
});