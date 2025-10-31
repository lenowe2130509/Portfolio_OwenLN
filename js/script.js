document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

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
                transitionInitial.appendChild(shine);
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
        const panels = {
            left: document.querySelector('.transition-panel.left'),
            right: document.querySelector('.transition-panel.right')
        };

        function startTransition() {
            transition.style.visibility = 'visible';
            panels.left.style.transform = 'translateX(0)';
            panels.right.style.transform = 'translateX(0)';
        }

        function endTransition() {
            panels.left.style.transform = 'translateX(-100%)';
            panels.right.style.transform = 'translateX(100%)';
            setTimeout(() => {
                transition.style.visibility = 'hidden';
            }, 600);
        }

        return { startTransition, endTransition };
    }

    // Fonction pour initialiser les animations de section
    function initSectionAnimations(sectionName) {
        switch(sectionName) {
            case 'hero':
                const heroTl = gsap.timeline({ delay: 0.2 });
                
                heroTl
                    .from('.hero-bg', {
                        duration: 1.2,
                        scale: 1.1,
                        opacity: 0,
                        ease: 'power2.out'
                    })
                    .from('.glitch-text', {
                        duration: 1,
                        y: 100,
                        opacity: 0,
                        ease: 'back.out(1.7)',
                        skewY: 7
                    })
                    .from('.subtitle', {
                        duration: 0.8,
                        y: 50,
                        opacity: 0,
                        ease: 'power3.out'
                    }, '-=0.4')
                    .from('.tech-stack', {
                        duration: 0.8,
                        y: 30,
                        opacity: 0,
                        stagger: 0.1
                    }, '-=0.4')
                    .from('.cta-container', {
                        duration: 0.8,
                        scale: 0.9,
                        opacity: 0,
                        ease: 'back.out(1.7)'
                    }, '-=0.6')
                    .from('.scroll-indicator', {
                        duration: 0.5,
                        y: -20,
                        opacity: 0
                    }, '-=0.4');

                // Mouse follow effect
                const cursor = document.querySelector('.mouse-follow-overlay');
                if (cursor) {
                    window.addEventListener('mousemove', (e) => {
                        const x = e.clientX;
                        const y = e.clientY;
                        cursor.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(108, 99, 255, 0.15), transparent 80%)`;
                    });
                }
                break;

            case 'apropos':
                gsap.from('.apropos-text', {
                    scrollTrigger: {
                        trigger: '.apropos-text',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    },
                    duration: 1,
                    y: 50,
                    opacity: 0,
                    ease: 'power3.out'
                });

                gsap.from('.stats-grid .stat-card', {
                    scrollTrigger: {
                        trigger: '.stats-grid',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
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
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
                });
                break;

            case 'experiences':
                gsap.from('.experience-card', {
                    scrollTrigger: {
                        trigger: '.carousel-track',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    y: 30,
                    opacity: 0,
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
                });
                break;

            case 'passions':
                gsap.from('.passion-card', {
                    scrollTrigger: {
                        trigger: '.passions-grid',
                        start: 'top 80%'
                    },
                    duration: 0.8,
                    scale: 0.8,
                    opacity: 0,
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
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

                gsap.from('.contact-btn', {
                    scrollTrigger: {
                        trigger: '.contact-links',
                        start: 'top 85%'
                    },
                    duration: 0.6,
                    y: 20,
                    opacity: 0,
                    stagger: 0.2,
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
                            end: 'bottom 20%',
                            toggleActions: 'play none none reverse'
                        },
                        duration: 0.8,
                        y: 50,
                        opacity: 0,
                        ease: 'back.out(1.7)'
                    });
                }
                break;
        }
    }

    // Écouter l'événement de chargement de section
    document.addEventListener('section:loaded', (e) => {
        const sectionName = e.detail.name;
        initSectionAnimations(sectionName);
    });

    // Animation de la navigation
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

    // Initialize page transitions
    const pageTransitions = initPageTransitions();

    // Listen for navigation events
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-section');
            pageTransitions.startTransition();
            setTimeout(() => {
                window.location.hash = link.getAttribute('href');
                pageTransitions.endTransition();
            }, 600);
        });
    });

    console.log('✅ Animations initialized');
});