/*
 * FICHIER: gallery-init.js
 * DESCRIPTION: Initialisation des galeries pour toutes les pages
 */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Détecter la page actuelle
    const pageType = detectPageType();
    
    if (pageType) {
        initGallery(pageType);
    }
});

/*
 * FONCTION: detectPageType()
 * DESCRIPTION: Détecte le type de page selon l'URL ou le body class
 */
function detectPageType() {
    const bodyClass = document.body.className;
    const currentPath = window.location.pathname;
    
    if (bodyClass.includes('page-destination') || currentPath.includes('destination')) {
        return 'destination';
    } else if (bodyClass.includes('page-crew') || currentPath.includes('crew')) {
        return 'crew';
    } else if (bodyClass.includes('page-techno') || currentPath.includes('techno')) {
        return 'technology';
    }
    
    return null;
}

/*
 * FONCTION: initGallery()
 * DESCRIPTION: Initialise la galerie pour le type de page
 */
async function initGallery(type) {
    try {
        console.log(`Initializing ${type} gallery...`);
        
        // Créer la galerie
        const gallery = new Gallery(type);
        
        // Attendre un peu que la galerie soit initialisée
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Attacher l'événement au bouton
        const galleryButton = document.getElementById('gallery-btn');
        
        if (galleryButton) {
            console.log('Attaching event to gallery button...');
            
            // Attacher l'événement
            galleryButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Gallery button clicked!');
                gallery.openGallery();
            });
            
            console.log('Gallery button event attached successfully');
        } else {
            console.warn('Gallery button not found');
        }
        
        console.log(`${type} gallery initialized successfully`);
        
    } catch (error) {
        console.error(`Failed to initialize ${type} gallery:`, error);
    }
}