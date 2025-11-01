// ============================================
// CAROUSEL 3D SEKAI STYLE - VERSION AMÉLIORÉE
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
        indicator.textContent = 'Maintenez et glissez pour tourner (horizontal et vertical)';
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
// CAROUSEL EXPÉRIENCES (Simple)
// ============================================
class SimpleCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.items = document.querySelectorAll('.carousel-item-exp');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageInfo = document.getElementById('pageInfo');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.currentIndex = 0;
        this.totalPages = this.items.length;
        
        if (this.track && this.items.length > 0) {
            this.init();
        }
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
let sekaiCarousel = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé');
    
    // ============================================
    // ANIMATION DU RIDEAU
    // ============================================
    const transitionInitial = document.querySelector('.page-transition-initial');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (curtainLeft && curtainRight) {
                curtainLeft.style.transform = 'translateX(-100%)';
                curtainRight.style.transform = 'translateX(100%)';
            }
            
            setTimeout(() => {
                if (transitionInitial) {
                    transitionInitial.remove();
                }
                
                // ✅ DÉMARRER LES ANIMATIONS GSAP APRÈS LA FERMETURE DU RIDEAU
                initGSAPAnimations();
                
            }, 1200);
        }, 300);
    });

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
        
        // Rafraîchir ScrollTrigger après un court délai
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        
        // Définir les positions de départ avant les animations
        gsap.set('.hero-title', { y: 80 });
        gsap.set('.hero-subtitle', { y: 30 });
        gsap.set('.cta-button', { y: 20 });
        
        // Hero - Animations avec opacité finale
        gsap.to('.hero-title', {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: 'power4.out',
            delay: 0.2
        });
        
        gsap.to('.hero-subtitle', {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            delay: 0.5
        });
        
        gsap.to('.cta-button', {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: 'back.out(1.7)',
            delay: 0.8
        });
        
        // À propos
        gsap.to('.apropos-text', {
            scrollTrigger: {
                trigger: '.section-apropos',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => gsap.set('.apropos-text', { y: 60, opacity: 0 }),
                onEnterBack: () => gsap.set('.apropos-text', { y: 60, opacity: 0 })
            },
            duration: 1,
            y: 0,
            opacity: 1,
            ease: 'power3.out'
        });
        
        gsap.to('.stat-card', {
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 80%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => gsap.set('.stat-card', { y: 40, opacity: 0 }),
                onEnterBack: () => gsap.set('.stat-card', { y: 40, opacity: 0 })
            },
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power3.out'
        });
        
        // Compétences 3D
        gsap.to('.carousel-3d', {
            scrollTrigger: {
                trigger: '.section-competences',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => gsap.set('.carousel-3d', { scale: 0.8, opacity: 0 }),
                onEnterBack: () => gsap.set('.carousel-3d', { scale: 0.8, opacity: 0 })
            },
            duration: 1.2,
            scale: 1,
            opacity: 1,
            ease: 'power3.out'
        });
        
        // Expériences
        gsap.to('.experience-card', {
            scrollTrigger: {
                trigger: '.section-experiences',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => gsap.set('.experience-card', { x: -50, opacity: 0 }),
                onEnterBack: () => gsap.set('.experience-card', { x: -50, opacity: 0 })
            },
            duration: 0.8,
            x: 0,
            opacity: 1,
            stagger: 0.15,
            ease: 'power3.out'
        });
        
        // Formations - Animation indépendante (nouvelles cartes style Sabani)
        const formationsSection = document.querySelector('#formations');
        if (formationsSection) {
            const formationsCards = formationsSection.querySelectorAll('.formation-item');
            gsap.to(formationsCards, {
                scrollTrigger: {
                    trigger: '#formations',
                    start: 'top 70%',
                    end: 'bottom 30%',
                    toggleActions: 'play reverse play reverse',
                    onEnter: () => gsap.set(formationsCards, { y: 60, opacity: 0 }),
                    onEnterBack: () => gsap.set(formationsCards, { y: 60, opacity: 0 })
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }
        
        // Formations Autres - Animation indépendante (nouvelles cartes style Sabani)
        const formationsAutresSection = document.querySelector('#formations-autres');
        if (formationsAutresSection) {
            const formationsAutresCards = formationsAutresSection.querySelectorAll('.formation-item');
            gsap.to(formationsAutresCards, {
                scrollTrigger: {
                    trigger: '#formations-autres',
                    start: 'top 70%',
                    end: 'bottom 30%',
                    toggleActions: 'play reverse play reverse',
                    onEnter: () => gsap.set(formationsAutresCards, { y: 60, opacity: 0 }),
                    onEnterBack: () => gsap.set(formationsAutresCards, { y: 60, opacity: 0 })
                },
                duration: 0.8,
                y: 0,
                opacity: 1,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }
        
        // Passions - Animation indépendante
        const passionsSection = document.querySelector('#passions');
        if (passionsSection) {
            const passionsCards = passionsSection.querySelectorAll('.passion-card');
            gsap.to(passionsCards, {
                scrollTrigger: {
                    trigger: '#passions',
                    start: 'top 70%',
                    end: 'bottom 30%',
                    toggleActions: 'play reverse play reverse',
                    onEnter: () => gsap.set(passionsCards, { scale: 0.8, opacity: 0 }),
                    onEnterBack: () => gsap.set(passionsCards, { scale: 0.8, opacity: 0 })
                },
                duration: 0.8,
                scale: 1,
                opacity: 1,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
        
        // Contact
        gsap.to('.contact-text', {
            scrollTrigger: {
                trigger: '.section-contact',
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => gsap.set('.contact-text', { y: 50, opacity: 0 }),
                onEnterBack: () => gsap.set('.contact-text', { y: 50, opacity: 0 })
            },
            duration: 1,
            y: 0,
            opacity: 1,
            ease: 'power3.out'
        });
        
        gsap.to('.contact-btn', {
            scrollTrigger: {
                trigger: '.contact-links',
                start: 'top 80%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => gsap.set('.contact-btn', { y: 30, opacity: 0 }),
                onEnterBack: () => gsap.set('.contact-btn', { y: 30, opacity: 0 })
            },
            duration: 0.6,
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
        
        console.log('✨ Toutes les animations GSAP sont configurées');
    }

    // ============================================
    // NAVIGATION SCROLL
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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
    // INITIALISATION CAROUSELS
    // ============================================
    setTimeout(() => {
        // Carousel expériences
        if (document.querySelector('.carousel-track')) {
            new SimpleCarousel();
            console.log('✅ Carousel expériences initialisé');
        }
        
        // Carousel 3D Sekai
        const carouselElement = document.querySelector('.carousel-3d');
        if (carouselElement) {
            sekaiCarousel = new SekaiCarousel3D();
            console.log('✅ Carousel 3D Sekai initialisé');
        } else {
            console.error('❌ Element .carousel-3d non trouvé !');
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
        
        const clickables = document.querySelectorAll('a, button, .skill-card, .passion-card, .carousel-control');
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
    console.log('✨ Portfolio Owen Le Nadant - Style Sekai One');
    console.log('🎪 Carousel 3D:', sekaiCarousel ? 'ACTIF ✅' : 'INACTIF ❌');
});