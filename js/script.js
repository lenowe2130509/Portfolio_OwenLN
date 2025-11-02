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

    // Bouclage fluide
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
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }
}

// Initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  new ExperienceCarousel();
});



// ============================================
// VARIABLES GLOBALES
// ============================================

let sekaiCarousel = null;
let experienceCarousel = null;
let curtainAnimationDone = false;

// ============================================
// FONCTION D'INITIALISATION PRINCIPALE
// ============================================

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
            
            curtainAnimationDone = true;
            document.body.classList.add('loaded');
            
            initGSAPAnimations();
            
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
    
    // Hero
    gsap.fromTo('.hero-title', 
        { y: 80, opacity: 0 },
        { 
            duration: 1.2,
            y: 0,
            opacity: 1,
            ease: 'power4.out',
            delay: 0.2,
            onComplete: function() {
                this.targets()[0].classList.add('gsap-animated');
            }
        }
    );
    
    gsap.fromTo('.hero-subtitle',
        { y: 30, opacity: 0 },
        {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            delay: 0.6,
            onComplete: function() {
                this.targets()[0].classList.add('gsap-animated');
            }
        }
    );
    
    gsap.fromTo('.cta-button',
        { y: 20, opacity: 0 },
        {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: 'back.out(1.7)',
            delay: 1,
            onComplete: function() {
                this.targets()[0].classList.add('gsap-animated');
            }
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
            ease: 'power3.out',
            onComplete: function() {
                this.targets()[0].classList.add('gsap-animated');
            }
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
            ease: 'power3.out',
            onComplete: function() {
                gsap.utils.toArray('.stat-card').forEach(card => {
                    card.classList.add('gsap-animated');
                });
            }
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
            ease: 'power3.out',
            onComplete: function() {
                this.targets()[0].classList.add('gsap-animated');
            }
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
                ease: 'power3.out',
                onComplete: function() {
                    formationsCards.forEach(card => {
                        card.classList.add('gsap-animated');
                    });
                }
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
                ease: 'power3.out',
                onComplete: function() {
                    passionsCards.forEach(card => {
                        card.classList.add('gsap-animated');
                    });
                }
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
            ease: 'power3.out',
            onComplete: function() {
                this.targets()[0].classList.add('gsap-animated');
            }
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
            ease: 'power3.out',
            onComplete: function() {
                gsap.utils.toArray('.contact-btn').forEach(btn => {
                    btn.classList.add('gsap-animated');
                });
            }
        }
    );
    
    console.log('✨ Toutes les animations GSAP sont configurées');
}

// ============================================
// NAVIGATION
// ============================================

const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Navigation Mobile
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu && navOverlay) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    navOverlay.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Smooth Scroll
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
// PARALLAXE HERO
// ============================================

const heroContent = document.querySelector('.hero-content');

if (heroContent) {
    // 1️⃣ apparition fluide au chargement
    window.addEventListener('load', () => {
        heroContent.style.opacity = 1;
        heroContent.style.transform = 'translateY(0)';
    });

    // 2️⃣ parallax léger au scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        heroContent.style.transform = `translateY(${parallax}px)`;
    });
}

const heroFade = document.querySelector('.hero-fade');
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (!heroFade || !hero) return;
    const scrollTop = window.scrollY;
    const heroHeight = hero.offsetHeight;

    const opacity = Math.min(scrollTop / heroHeight, 1);
    heroFade.style.opacity = opacity;
});



// ============================================
// CURSEUR CUSTOM
// ============================================

if (window.innerWidth > 768) {
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
// INITIALISATION CAROUSELS
// ============================================

setTimeout(() => {
    if (document.querySelector('.carousel-track')) {
        experienceCarousel = new ExperienceCarousel();
        console.log('✅ Carousel expériences initialisé');
    }
    
    if (document.querySelector('.carousel-3d')) {
        sekaiCarousel = new SekaiCarousel3D();
        console.log('✅ Carousel 3D Sekai initialisé');
    }
}, 100);

// ============================================
// DÉMARRAGE
// ============================================

document.addEventListener('sectionsLoaded', () => {
    console.log('✨ Sections chargées - Initialisation du portfolio');
    setTimeout(() => {
        initializePortfolio();
    }, 200);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        if (!curtainAnimationDone) {
            console.warn('⚠️ Initialisation de secours...');
            initializePortfolio();
        }
    }, 2000);
});

console.log('✨ Script principal chargé');