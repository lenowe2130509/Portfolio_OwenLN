// ============================================
// CAROUSEL 3D SEKAI STYLE - MODULE
// ============================================

export class SekaiCarousel3D {
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