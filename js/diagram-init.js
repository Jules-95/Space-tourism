/*
 * FICHIER: diagram-init.js
 * DESCRIPTION: Point d'entrée pour le système de diagrammes sur la page destination
 * 
 * RÔLE: Ce fichier initialise le système de diagrammes et attache les événements
 * nécessaires pour le bouton "Diagramme" sur la page destination.html
 * 
 * UTILISATION:
 * Ce fichier est automatiquement exécuté quand la page destination.html est chargée
 */

// Fonction pour charger un script dynamiquement avec retry
function loadScript(src, retries = 3) {
    return new Promise((resolve, reject) => {
        let attempt = 0;
        
        function tryLoad() {
            attempt++;
            console.log(`Tentative ${attempt} de chargement de ${src}`);
            
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`✅ ${src} chargé avec succès`);
                resolve();
            };
            script.onerror = () => {
                console.error(`❌ Échec du chargement de ${src} (tentative ${attempt}/${retries})`);
                if (attempt < retries) {
                    setTimeout(tryLoad, 1000);
                } else {
                    reject(new Error(`Échec du chargement de ${src} après ${retries} tentatives`));
                }
            };
            document.head.appendChild(script);
        }
        
        tryLoad();
    });
}

// Attendre que le DOM soit chargé ET charger les bibliothèques explicitement
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initialisation du système de diagrammes pour la page destination...');
    
    try {
        // Charger les bibliothèques explicitement avec différents CDN
        console.log('Chargement des bibliothèques C3/D3...');
        
        try {
            // C3.js 0.7.20 nécessite D3 v5.x, pas v7
            await loadScript('https://d3js.org/d3.v5.min.js');
            await loadScript('https://cdn.jsdelivr.net/npm/c3@0.7.20/c3.min.js');
        } catch (error) {
            console.log('Premier CDN échoué, essai avec unpkg...');
            await loadScript('https://unpkg.com/d3@5.16.0/dist/d3.min.js');
            await loadScript('https://unpkg.com/c3@0.7.20/c3.min.js');
        }
        
        // Attendre un peu que les bibliothèques soient initialisées
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Vérifier que les bibliothèques sont chargées
        console.log('Vérification des bibliothèques...');
        console.log('window.d3:', typeof window.d3, window.d3);
        console.log('window.c3:', typeof window.c3, window.c3);
        
        if (typeof c3 === 'undefined') {
            console.error('C3.js non disponible - window.c3:', window.c3);
            throw new Error('C3.js n\'est pas chargé');
        }
        if (typeof d3 === 'undefined') {
            console.error('D3.js non disponible - window.d3:', window.d3);
            throw new Error('D3.js n\'est pas chargé');
        }
        
        console.log('✅ Bibliothèques C3/D3 chargées et vérifiées avec succès');
        
        // Créer une instance du DiagramManager
        const diagramManager = new DiagramManager();
        
        // Initialiser le système (charger les données, etc.)
        await diagramManager.init();
        
        // Attacher l'événement au bouton "Diagramme"
        const diagramBtn = document.getElementById('diagram-btn');
        if (diagramBtn) {
            diagramBtn.addEventListener('click', () => {
                console.log('Clic sur le bouton Diagramme - ouverture du diagramme...');
                diagramManager.openDiagram();
            });
            
            console.log('Bouton Diagramme configuré avec succès');
        } else {
            console.warn('Bouton Diagramme non trouvé dans la page');
        }
        
        // Écouter les événements du système de diagrammes pour le débogage
        document.addEventListener('diagram:initialized', () => {
            console.log('✅ Système de diagrammes initialisé');
        });
        
        document.addEventListener('diagram:init-error', (e) => {
            console.error('❌ Erreur d\'initialisation du diagramme:', e.detail.error);
        });
        
        document.addEventListener('diagram-modal:opened', () => {
            console.log('📊 Modal du diagramme ouverte');
        });
        
        document.addEventListener('diagram-modal:closed', () => {
            console.log('📊 Modal du diagramme fermée');
        });
        
        document.addEventListener('diagram:open-error', (e) => {
            console.error('❌ Erreur d\'ouverture du diagramme:', e.detail.error);
        });
        
        // Rendre le diagramManager accessible globalement pour le débogage
        window.destinationDiagramManager = diagramManager;
        
        console.log('🎉 Système de diagrammes pour destination.html prêt!');
        
    } catch (error) {
        console.error('❌ Erreur critique lors de l\'initialisation du système de diagrammes:', error);
        
        // Afficher un message d'erreur à l'utilisateur si le bouton existe
        const diagramBtn = document.getElementById('diagram-btn');
        if (diagramBtn) {
            diagramBtn.addEventListener('click', () => {
                alert('Le système de diagrammes n\'est pas disponible. Veuillez réessayer plus tard.');
            });
        }
    }
});