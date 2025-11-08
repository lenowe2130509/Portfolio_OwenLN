// ============================================
// LOADER - Chargement des sections HTML
// ============================================

class SectionLoader {
    constructor() {
        this.sections = [
            { id: 'navigation', file: 'sections/navigation.html' },
            { id: 'hero', file: 'sections/hero.html' },
            { id: 'apropos', file: 'sections/apropos.html' },
            { id: 'competences', file: 'sections/competences.html' },
            { id: 'frameworks', file: 'sections/frameworks.html' },
            { id: 'experiences', file: 'sections/experiences.html' },
            { id: 'projets', file: 'sections/projets.html' },
            { id: 'formations', file: 'sections/formations.html' },
            { id: 'formations-autres', file: 'sections/formations-autres.html' },
            { id: 'passions', file: 'sections/passions.html' },
            { id: 'contact', file: 'sections/contact.html' },
            { id: 'footer', file: 'sections/footer.html' }
        ];
        
        this.loadedCount = 0;
        this.totalSections = this.sections.length;
    }
    
    async loadSection(section) {
        try {
            const response = await fetch(section.file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const placeholder = document.getElementById(`${section.id}-placeholder`);
            
            if (placeholder) {
                placeholder.outerHTML = html;
                this.loadedCount++;
                //consol.log(`✅ Section ${section.id} chargée (${this.loadedCount}/${this.totalSections})`);
            } else {
                console.warn(`⚠️ Placeholder ${section.id}-placeholder non trouvé`);
            }
        } catch (error) {
            console.error(`❌ Erreur lors du chargement de ${section.file}:`, error);
        }
    }
    
    async loadAll() {
        //consol.log('🚀 Début du chargement des sections...');
        
        // Charger toutes les sections en parallèle
        await Promise.all(
            this.sections.map(section => this.loadSection(section))
        );
        
        //consol.log(`✨ ${this.loadedCount}/${this.totalSections} sections chargées!`);
        
        // Déclencher un événement personnalisé
        document.dispatchEvent(new Event('sectionsLoaded'));
    }
}

// Initialiser le chargement dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const loader = new SectionLoader();
        loader.loadAll();
    });
} else {
    // Le DOM est déjà chargé
    const loader = new SectionLoader();
    loader.loadAll();
}