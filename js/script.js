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
        
        // État - Rotation horizontale et verticale
        this.currentRotationY = 0;
        this.targetRotationY = 0;
        this.currentRotationX = 0;
        this.targetRotationX = 0;
        
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.startRotationY = 0;
        this.startRotationX = 0;
        
        this.autoRotateSpeed = -0.08; // Sens anti-horaire (négatif)
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
        // Flèche gauche
        if (this.rightControl) {
            this.rightControl.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopAutoRotation();
                this.rotateBy(-45, 0);
                setTimeout(() => this.startAutoRotation(), 3000);
                console.log('← Rotation gauche');
            });
        }
        
        // Flèche droite
        if (this.leftControl) {
            this.leftControl.addEventListener('click', (e) => {
                e.preventDefault();
                this.stopAutoRotation();
                this.rotateBy(45, 0);
                setTimeout(() => this.startAutoRotation(), 3000);
                console.log('→ Rotation droite');
            });
        }
    }
    
    setupDragInteraction() {
        // Souris
        this.carousel.addEventListener('mousedown', (e) => {
            this.onDragStart(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            this.onDragMove(e);
        });
        
        document.addEventListener('mouseup', () => {
            this.onDragEnd();
        });
        
        // Touch
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
        
        // Empêcher la sélection
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
        console.log('🖱️ Drag démarré');
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        
        // Rotation horizontale (gauche/droite)
        const deltaX = e.clientX - this.startX;
        const rotationChangeY = deltaX * 0.2; // Sensibilité RÉDUITE (était 0.3)
        this.targetRotationY = this.startRotationY + rotationChangeY;
        
        // Rotation verticale (haut/bas) - NOUVEAU
        const deltaY = e.clientY - this.startY;
        const rotationChangeX = deltaY * 0.15; // Sensibilité verticale
        this.targetRotationX = this.startRotationX - rotationChangeX;
        
        // Limiter la rotation verticale entre -30° et +30°
        this.targetRotationX = Math.max(-30, Math.min(30, this.targetRotationX));
    }
    
    onDragEnd() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.carousel.classList.remove('dragging');
        console.log('🖱️ Drag terminé');
        
        // Retour progressif à l'horizontale
        this.targetRotationX = 0;
        
        // Redémarrer l'auto-rotation après 2 secondes
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
        console.log('▶️ Auto-rotation activée');
    }
    
    stopAutoRotation() {
        this.isAutoRotating = false;
        console.log('⏸️ Auto-rotation désactivée');
    }
    
    animate() {
        // Auto-rotation si activée
        if (this.isAutoRotating && !this.isDragging) {
            this.targetRotationY += this.autoRotateSpeed;
        }
        
        // Interpolation smooth pour les deux axes
        const diffY = this.targetRotationY - this.currentRotationY;
        const diffX = this.targetRotationX - this.currentRotationX;
        
        this.currentRotationY += diffY * 0.08; // Vitesse smooth RÉDUITE (était 0.1)
        this.currentRotationX += diffX * 0.08;
        
        // Appliquer les rotations sur les deux axes
        if (this.rotation) {
            this.rotation.style.transform = `rotateX(${this.currentRotationX}deg) rotateY(${this.currentRotationY}deg)`;
        }
        
        // Mettre à jour les cartes en avant
        this.updateFrontCards();
        
        // Continue l'animation
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateFrontCards() {
        // Calculer quelle carte devrait être devant en fonction de la rotation
        // Normaliser la rotation entre 0 et 360
        const normalizedRotation = ((this.currentRotationY % 360) + 360) % 360;
        
        // Chaque carte occupe 45° (360° / 8 cartes)
        const totalCards = this.items.length;
        const degreesPerCard = 360 / totalCards;
        
        // INVERSER le calcul pour que la luminescence suive l'ordre HTML (0→1→2→3...)
        // même si la rotation est anti-horaire
        let frontCardIndex = Math.round((360 - normalizedRotation) / degreesPerCard) % totalCards;
        
        // Appliquer la classe is-front uniquement à la carte calculée
        this.items.forEach((item, index) => {
            if (index === frontCardIndex) {
                item.classList.add('is-front');
                // Debug occasionnel
                if (Math.random() < 0.01) {
                    console.log(`✨ Carte ${index} lumineuse: ${item.querySelector('.skill-title')?.textContent}`);
                }
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
            }, 1200);
        }, 300);
    });

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    if (typeof gsap !== 'undefined') {
        console.log('✅ GSAP chargé');
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero
        gsap.from('.hero-title', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power4.out',
            delay: 1.5
        });
        
        gsap.from('.hero-subtitle', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 1.8
        });
        
        gsap.from('.cta-button', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 2
        });
        
        // À propos
        gsap.from('.apropos-text', {
            scrollTrigger: {
                trigger: '.section-apropos',
                start: 'top 70%',
            },
            duration: 1,
            y: 60,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.stat-card', {
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 80%',
            },
            duration: 0.8,
            y: 40,
            opacity: 0,
            stagger: 0.1,
            ease: 'power3.out'
        });
        
        // Compétences 3D
        gsap.from('.carousel-3d', {
            scrollTrigger: {
                trigger: '.section-competences',
                start: 'top 70%',
            },
            duration: 1.2,
            scale: 0.8,
            opacity: 0,
            ease: 'power3.out'
        });
        
        // Expériences
        gsap.from('.experience-card', {
            scrollTrigger: {
                trigger: '.section-experiences',
                start: 'top 70%',
            },
            duration: 0.8,
            x: -50,
            opacity: 0,
            stagger: 0.15,
            ease: 'power3.out'
        });
        
        // Passions
        gsap.from('.passion-card', {
            scrollTrigger: {
                trigger: '.section-passions',
                start: 'top 70%',
            },
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
        
        // Contact
        gsap.from('.contact-text', {
            scrollTrigger: {
                trigger: '.section-contact',
                start: 'top 70%',
            },
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.contact-btn', {
            scrollTrigger: {
                trigger: '.contact-links',
                start: 'top 80%',
            },
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    } else {
        console.warn('⚠️ GSAP non chargé');
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
        
        // Carousel 3D Sekai - IMPORTANT
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