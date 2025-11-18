// ============================================
// LOADER - VERSION CORRIGÉE
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
            console.log(`📥 Chargement ${section.file}...`);
            
            const response = await fetch(section.file);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - ${section.file}`);
            }
            
            const html = await response.text();
            const placeholder = document.getElementById(`${section.id}-placeholder`);
            
            if (placeholder) {
                placeholder.outerHTML = html;
                this.loadedCount++;
                console.log(`✅ ${section.id} chargée (${this.loadedCount}/${this.totalSections})`);
            } else {
                console.warn(`⚠️ Placeholder #${section.id}-placeholder non trouvé`);
            }
            
        } catch (error) {
            console.error(`❌ Erreur ${section.file}:`, error);
        }
    }
    
    async loadAll() {
        console.log('🚀 Début chargement sections...');
        
        // Charge sections en parallèle
        await Promise.all(
            this.sections.map(section => this.loadSection(section))
        );
        
        console.log(`✨ ${this.loadedCount}/${this.totalSections} sections chargées`);
        
        // Déclenche événement
        document.dispatchEvent(new Event('sectionsLoaded'));
        console.log('📢 Event sectionsLoaded déclenché');
    }
}

// ============================================
// INITIALISATION
// ============================================

function initLoader() {
    console.log('🔧 Loader.js chargé');
    const loader = new SectionLoader();
    loader.loadAll();
}

// Démarre dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
} else {
    initLoader();
}

console.log('✅ Loader.js prêt');