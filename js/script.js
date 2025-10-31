// ============================================
// ANIMATIONS GSAP AU SCROLL (VERSION FLUIDE)
// ============================================

// Attendre que tout soit chargé
document.addEventListener('DOMContentLoaded', function() {

// Attendre que GSAP soit chargé
gsap.registerPlugin(ScrollTrigger);

// Configuration globale pour des animations plus fluides
gsap.defaults({
    ease: 'power2.out',
    duration: 0.6
});

// ===== ANIMATIONS AU CHARGEMENT DE LA PAGE =====

// Animation du Hero au chargement (plus rapide)
const heroTimeline = gsap.timeline({ delay: 0.1 });

heroTimeline
    .from('.hero-title', {
        duration: 0.8,
        y: -30,
        opacity: 0,
        scale: 0.9,
        ease: 'back.out(1.5)'
    })
    .from('.hero-subtitle', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.cta-button', {
        duration: 0.7,
        y: 20,
        opacity: 0,
        scale: 0.9,
        ease: 'back.out(1.5)'
    }, '-=0.3');

// Animation de la navbar (plus rapide)
gsap.from('.navbar', {
    duration: 0.6,
    y: -80,
    opacity: 0,
    ease: 'power3.out'
});

// ===== ANIMATIONS AU SCROLL (DÉCLENCHEMENT PLUS TÔT) =====

// Configuration par défaut pour ScrollTrigger
ScrollTrigger.defaults({
    start: 'top 75%',
    toggleActions: 'play none none none',
});

// Animation des titres de section
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 70%'
        },
        duration: 0.6,
        x: -60,
        opacity: 0
    });
});

// Animation des éléments avec classe hidden-fade
gsap.utils.toArray('.hidden-fade').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.7,
        opacity: 0
    });
});

// Animation des éléments avec classe hidden-slide-up
gsap.utils.toArray('.hidden-slide-up').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.6,
        y: 40,
        opacity: 0
    });
});

// Animation des éléments avec classe hidden-slide-down
gsap.utils.toArray('.hidden-slide-down').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.6,
        y: -40,
        opacity: 0
    });
});

// Animation des éléments avec classe hidden-slide-left
gsap.utils.toArray('.hidden-slide-left').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.6,
        x: -60,
        opacity: 0
    });
});

// Animation des éléments avec classe hidden-slide-right
gsap.utils.toArray('.hidden-slide-right').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.6,
        x: 60,
        opacity: 0
    });
});

// Animation des éléments avec classe hidden-scale
gsap.utils.toArray('.hidden-scale').forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.7,
        scale: 0.85,
        opacity: 0,
        ease: 'back.out(1.3)'
    });
});

// Animation des éléments avec classe hidden-rotate (plus fluide)
gsap.utils.toArray('.hidden-rotate').forEach((element, index) => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: 'top 75%'
        },
        duration: 0.7,
        rotation: -10,
        scale: 0.9,
        opacity: 0,
        ease: 'back.out(1.3)',
        delay: index * 0.1
    });
});

// Animation des stat-cards avec effet stagger (plus rapide)
const statCards = gsap.utils.toArray('.stat-card');
if (statCards.length > 0) {
    gsap.from(statCards, {
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 75%'
        },
        duration: 0.5,
        y: 30,
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        ease: 'back.out(1.3)'
    });
}

// Animation des skill-cards (groupées pour plus de fluidité)
const skillCards = gsap.utils.toArray('.skill-card');
if (skillCards.length > 0) {
    gsap.from(skillCards, {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 75%'
        },
        duration: 0.6,
        y: 40,
        rotation: -5,
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.3)'
    });
}

// Animation des passion-cards avec effet 3D (plus doux)
const passionCards = gsap.utils.toArray('.passion-card');
if (passionCards.length > 0) {
    gsap.from(passionCards, {
        scrollTrigger: {
            trigger: '.passions-grid',
            start: 'top 75%'
        },
        duration: 0.7,
        rotationY: 45,
        scale: 0.8,
        opacity: 0,
        stagger: 0.12,
        ease: 'back.out(1.5)'
    });
}

// Animation du carrousel d'expériences
gsap.from('.carousel-container', {
    scrollTrigger: {
        trigger: '.carousel-container',
        start: 'top 75%'
    },
    duration: 0.8,
    y: 40,
    opacity: 0
});

// Animation des boutons de contact
const contactBtns = gsap.utils.toArray('.contact-btn');
if (contactBtns.length > 0) {
    gsap.from(contactBtns, {
        scrollTrigger: {
            trigger: '.contact-links',
            start: 'top 75%'
        },
        duration: 0.5,
        y: 25,
        opacity: 0,
        scale: 0.9,
        stagger: 0.08,
        ease: 'back.out(1.5)'
    });
}

// Parallax subtil pour le hero-bg (plus doux)
gsap.to('.hero-bg', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
    },
    y: 150,
    opacity: 0.3
});

// Animation de compteur pour les stat-number (plus rapide)
gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = stat.textContent.replace('+', '').replace('%', '');
    const hasPlus = stat.textContent.includes('+');
    const hasPercent = stat.textContent.includes('%');
    
    if (!isNaN(parseInt(target)) && target !== '∞') {
        const finalValue = parseInt(target);
        
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 75%'
            },
            textContent: 0,
            duration: 1.5,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
                const current = Math.ceil(this.targets()[0].textContent);
                let displayText = current.toString();
                if (hasPlus) displayText += '+';
                if (hasPercent) displayText += '%';
                stat.textContent = displayText;
            }
        });
    }
});

// Animation du texte du contact
gsap.from('.contact-text', {
    scrollTrigger: {
        trigger: '.contact-text',
        start: 'top 75%'
    },
    duration: 0.6,
    y: 20,
    opacity: 0
});

// Amélioration de la fluidité du scroll
ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});

// ===== FIN DES ANIMATIONS GSAP =====


// ============================================
// CARROUSEL D'EXPÉRIENCES (VERSION CORRIGÉE)
// ============================================

    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.experience-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    // Vérifier que les éléments existent
    if (!track || !cards.length || !prevBtn || !nextBtn || !dotsContainer) {
        console.error('❌ Erreur : Éléments du carrousel non trouvés');
        console.log('Track:', track);
        console.log('Cards:', cards.length);
        console.log('PrevBtn:', prevBtn);
        console.log('NextBtn:', nextBtn);
        console.log('Dots:', dotsContainer);
        return;
    }
    
    console.log('✅ Carrousel initialisé avec', cards.length, 'expériences');
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Fonction pour détecter combien de cartes sont visibles
    function getVisibleCards() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    // Créer les dots
    function createDots() {
        dotsContainer.innerHTML = '';
        const visibleCards = getVisibleCards();
        const maxIndex = totalCards - visibleCards;
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToIndex(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Aller à un index spécifique
    function goToIndex(index) {
        const visibleCards = getVisibleCards();
        const maxIndex = totalCards - visibleCards;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    // Mettre à jour le carrousel
    function updateCarousel() {
        const visibleCards = getVisibleCards();
        const maxIndex = totalCards - visibleCards;
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        // Calculer la largeur d'une carte + gap
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap);
        
        // Déplacement total = (largeur carte + gap) * index
        const translateX = -(currentIndex * (cardWidth + gap));
        track.style.transform = `translateX(${translateX}px)`;
        
        // Mettre à jour les dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Désactiver les boutons si nécessaire
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        // Effet de focus sur les cartes visibles
        cards.forEach((card, index) => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = (index >= currentIndex && index < currentIndex + visibleCards) ? '1' : '0.5';
        });
    }
    
    // Bouton précédent
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Bouton suivant
    nextBtn.addEventListener('click', () => {
        const visibleCards = getVisibleCards();
        const maxIndex = totalCards - visibleCards;
        
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
            nextBtn.click();
        }
    });
    
    // Support du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        
        if (touchStartX - touchEndX > swipeThreshold && !nextBtn.disabled) {
            nextBtn.click();
        } else if (touchEndX - touchStartX > swipeThreshold && !prevBtn.disabled) {
            prevBtn.click();
        }
    });
    
    // Gestion du redimensionnement
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            currentIndex = 0;
            createDots();
            updateCarousel();
        }, 250);
    });
    
    // Initialisation du carrousel
    setTimeout(() => {
        createDots();
        updateCarousel();
        console.log('✅ Carrousel prêt !');
    }, 100); // Petit délai pour laisser le CSS se charger

}); // Fin du DOMContentLoaded