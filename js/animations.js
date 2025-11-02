// ============================================
// ANIMATIONS GSAP - MODULE
// ============================================

export function initGSAPAnimations() {
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