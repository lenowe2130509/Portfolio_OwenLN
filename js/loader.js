// Loader simple et robuste pour injecter sections/*.html et charger scripts une seule fois
document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const footer = document.getElementById('site-footer');
    const navLinks = document.querySelectorAll('.nav-menu a[data-section]');
    const loadedScripts = new Set();

    // Load footer immediately
    if (footer) {
        fetchHtml('sections/footer.html')
            .then(html => {
                footer.innerHTML = html;
                footer.removeAttribute('aria-hidden');
            })
            .catch(() => console.warn('Could not load footer'));
    }

    map = {
        'hero': 'sections/hero.html',
        'apropos': 'sections/apropos.html',
        'competences': 'sections/competences.html',
        'experiences': 'sections/experiences.html',
        'passions': 'sections/passions.html',
        'contact': 'sections/contact.html',
        'team': 'sections/team.html'
    };

    const sectionScripts = {
        'experiences': ['js/script.js'],
        'team': ['js/team.js'] // si tu ajoutes un team section nommée "team"
    };

    const pageTransition = document.querySelector('.page-transition');
    
    async function loadSection(name, push = true) {
        const path = map[name];
        if (!path) return console.warn('Section non mappée:', name);

        // Start transition
        pageTransition.classList.add('is-transitioning');

        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            const html = await fetchHtml(path);
            content.innerHTML = html;
            
            if (push) {
                const anchor = document.querySelector(`.nav-menu a[data-section="${name}"]`);
                const href = anchor ? anchor.getAttribute('href') : `#${name}`;
                history.pushState({ section: name }, '', href);
            }

            // Wait a bit before closing transition
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // End transition
            pageTransition.classList.remove('is-transitioning');

            // Initialize section
            document.dispatchEvent(new CustomEvent('section:loaded', { 
                detail: { name } 
            }));

            const scripts = sectionScripts[name] || [];
            scripts.forEach(src => loadScriptOnce(src));
        } catch (err) {
            console.error('Erreur chargement section:', err);
            content.innerHTML = `<p style="color:#f33">Impossible de charger la section ${name}.</p>`;
            pageTransition.classList.remove('is-transitioning');
        }
    }

    function fetchHtml(path) {
        return fetch(path).then(res => {
            if (!res.ok) throw new Error('Fetch failed ' + path);
            return res.text();
        });
    }

    async function loadSection(name, push = true) {
    const path = map[name];
    if (!path) return console.warn('Section non mappée:', name);

    try {
        const html = await fetchHtml(path);
        content.innerHTML = html;
        if (push) {
            const anchor = document.querySelector(`.nav-menu a[data-section="${name}"]`);
            const href = anchor ? anchor.getAttribute('href') : `#${name}`;
            history.pushState({ section: name }, '', href);
        }
        
        // Dispatch event after content is loaded
        document.dispatchEvent(new CustomEvent('section:loaded', { 
            detail: { name } 
        }));

        const scripts = sectionScripts[name] || [];
        scripts.forEach(src => loadScriptOnce(src));
    } catch (err) {
        console.error('Erreur chargement section:', err);
        content.innerHTML = `<p style="color:#f33">Impossible de charger la section ${name}.</p>`;
    }
}

    function loadScriptOnce(src) {
        if (loadedScripts.has(src)) return;
        const s = document.createElement('script');
        s.src = src;
        s.defer = true;
        document.body.appendChild(s);
        loadedScripts.add(src);
    }

    // nav click handlers
    navLinks.forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const section = a.dataset.section;
            loadSection(section, true);
        });
    });

    // delegate clicks inside content for links that reference data-section (CTA buttons)
    content.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-section]');
        if (!a) return;
        e.preventDefault();
        const section = a.dataset.section;
        loadSection(section, true);
    });

    // handle back/forward
    window.addEventListener('popstate', (e) => {
        const state = e.state;
        if (state && state.section) loadSection(state.section, false);
        else {
            // fallback to hash or hero
            const hash = location.hash || '#accueil';
            const link = document.querySelector(`.nav-menu a[href="${hash}"]`);
            const section = link ? link.dataset.section : 'hero';
            loadSection(section, false);
        }
    });

    // initial load based on hash or default hero
    (function init() {
        const hash = location.hash || '#accueil';
        const link = document.querySelector(`.nav-menu a[href="${hash}"]`);
        const initialSection = link ? link.dataset.section : 'hero';
        loadSection(initialSection, false);
    })();
});