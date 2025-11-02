// ============================================
// CAROUSEL EXPÉRIENCES - MODULE
// ============================================

export class ExperienceCarousel {
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