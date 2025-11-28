/*
 * FICHIER: DiagramManager.js
 * DESCRIPTION: Coordination du système de diagrammes (Principe SOLID: Dependency Inversion)
 * 
 * RÔLE: Cette classe coordonne les différentes composantes du système de diagrammes.
 * Elle applique le principe d'inversion de dépendances en dépendant des abstractions
 * plutôt que des implémentations concrètes.
 * 
 * PRINCIPE SOLID APPLIQUÉ:
 * - Single Responsibility Principle (SRP): Ne coordonne QUE les diagrammes
 * - Dependency Inversion Principle (DIP): Dépend des abstractions
 * - Interface Segregation Principle (ISP): Interface simple et cohérente
 * 
 * UTILISATION:
 * 1. Créer une instance: const diagramManager = new DiagramManager()
 * 2. Initialiser: await diagramManager.init()
 * 3. Ouvrir le diagramme: diagramManager.openDiagram()
 */
class DiagramManager {
    constructor() {
        // Dépendances injectées (DIP)
        this.modalManager = new DiagramModalManager();
        this.dataManager = new DiagramDataManager();
        this.renderer = new DiagramRenderer();
        
        // État du système
        this.isInitialized = false;
        this.dataLoaded = false;
        
        // ID unique pour le conteneur du diagramme
        this.chartContainerId = 'travel-time-chart';
        
        // Lier les événements
        this.bindEvents();
    }

    /*
     * MÉTHODE: init()
     * DESCRIPTION: Initialise le système de diagrammes
     * RETOURNE: Promise - résolue quand l'initialisation est terminée
     * 
     * LOGIQUE:
     * 1. Charger les données depuis destination.json
     * 2. Marquer le système comme initialisé
     * 3. Émettre un événement de succès
     */
    async init() {
        try {
            console.log('Initialisation du système de diagrammes...');
            
            // Charger les données
            await this.loadDiagramData();
            
            this.isInitialized = true;
            console.log('Système de diagrammes initialisé avec succès');
            
            this.emit('diagram:initialized');
            return true;
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du système de diagrammes:', error);
            this.emit('diagram:init-error', { error });
            throw error;
        }
    }

    /*
     * MÉTHODE: loadDiagramData()
     * DESCRIPTION: Charge les données nécessaires pour les diagrammes
     * RETOURNE: Promise - résolue quand les données sont chargées
     */
    async loadDiagramData() {
        try {
            await this.dataManager.loadDestinationData();
            this.dataLoaded = true;
            console.log('Données de diagrammes chargées avec succès');
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            throw error;
        }
    }

    /*
     * MÉTHODE: openDiagram()
     * DESCRIPTION: Ouvre la modal avec le diagramme des temps de voyage
     * 
     * LOGIQUE:
     * 1. Vérifier que le système est initialisé
     * 2. Créer le contenu HTML pour le diagramme
     * 3. Ouvrir la modal
     * 4. Rendre le diagramme après l'ouverture
     */
    async openDiagram() {
        try {
            // Vérifier l'initialisation
            if (!this.isInitialized) {
                console.warn('Le système de diagrammes n\'est pas initialisé. Initialisation en cours...');
                await this.init();
            }

            if (!this.dataLoaded) {
                console.warn('Les données ne sont pas chargées. Chargement en cours...');
                await this.loadDiagramData();
            }

            // Créer le contenu HTML pour la modal
            const modalContent = this.createModalContent();
            
            // Ouvrir la modal
            this.modalManager.open(modalContent);
            
            // Attendre un peu que la modal soit visible avant de rendre le diagramme
            setTimeout(() => {
                this.renderChart();
            }, 100);
            
            console.log('Diagramme ouvert avec succès');
            
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du diagramme:', error);
            this.emit('diagram:open-error', { error });
        }
    }

    /*
     * MÉTHODE: createModalContent()
     * DESCRIPTION: Crée le contenu HTML pour la modal du diagramme
     * RETOURNE: string - HTML du conteneur du diagramme
     */
    createModalContent() {
        return `
            <div id="${this.chartContainerId}" class="diagram-container">
                <!-- Le diagramme sera rendu ici par C3.js/D3.js -->
            </div>
        `;
    }

    /*
     * MÉTHODE: renderChart()
     * DESCRIPTION: Rend le diagramme dans la modal
     * 
     * LOGIQUE:
     * 1. Obtenir les données formatées
     * 2. Utiliser le renderer pour créer le diagramme
     * 3. Gérer les erreurs de rendu
     */
    renderChart() {
        try {
            // Obtenir les données formatées pour C3.js
            const chartData = this.dataManager.getTravelTimeData();
            
            if (!chartData) {
                throw new Error('Données de diagramme non disponibles');
            }

            // Rendre le diagramme avec C3.js
            this.renderer.renderTravelTimeChart(this.chartContainerId, chartData);
            
            console.log('Diagramme rendu avec succès');
            
        } catch (error) {
            console.error('Erreur lors du rendu du diagramme:', error);
            
            // Afficher un message d'erreur dans la modal
            const container = document.getElementById(this.chartContainerId);
            if (container) {
                container.innerHTML = `
                    <div style="color: #ff6b6b; text-align: center; padding: 2rem;">
                        <h3>Erreur de chargement</h3>
                        <p>Impossible d'afficher le diagramme des temps de voyage.</p>
                        <p style="font-size: 0.875rem; opacity: 0.8;">${error.message}</p>
                    </div>
                `;
            }
        }
    }

    /*
     * MÉTHODE: closeDiagram()
     * DESCRIPTION: Ferme la modal du diagramme
     */
    closeDiagram() {
        this.modalManager.close();
        console.log('Diagramme fermé');
    }

    /*
     * MÉTHODE: refreshDiagram()
     * DESCRIPTION: Actualise le diagramme avec de nouvelles données
     */
    async refreshDiagram() {
        try {
            // Recharger les données
            await this.loadDiagramData();
            
            // Si la modal est ouverte, actualiser le rendu
            if (this.modalManager.isOpen) {
                this.renderChart();
            }
            
            console.log('Diagramme actualisé avec succès');
            
        } catch (error) {
            console.error('Erreur lors de l\'actualisation du diagramme:', error);
        }
    }

    /*
     * MÉTHODE: bindEvents()
     * DESCRIPTION: Attache les écouteurs d'événements
     * 
     * ÉVÉNEMENTS ÉCOUTÉS:
     * - diagram-modal:closed: nettoyer les ressources quand la modal se ferme
     * - window.resize: redimensionner le diagramme
     */
    bindEvents() {
        // Nettoyer les ressources quand la modal se ferme
        document.addEventListener('diagram-modal:closed', () => {
            this.renderer.destroy();
        });

        // Redimensionner le diagramme quand la fenêtre change
        window.addEventListener('resize', () => {
            if (this.modalManager.isOpen) {
                this.renderer.resize();
            }
        });
    }

    /*
     * MÉTHODE: emit()
     * DESCRIPTION: Émet un événement pour la communication inter-classes
     * PARAMÈTRE: eventName - nom de l'événement à émettre
     * PARAMÈTRE: detail - données de l'événement (optionnel)
     */
    emit(eventName, detail = null) {
        const event = new CustomEvent(eventName, detail ? { detail } : {});
        document.dispatchEvent(event);
    }

    /*
     * MÉTHODE: destroy()
     * DESCRIPTION: Détruit le système et nettoie les ressources
     */
    destroy() {
        this.renderer.destroy();
        this.modalManager.close();
        
        // Supprimer les écouteurs d'événements
        document.removeEventListener('diagram-modal:closed', this.renderer.destroy);
        window.removeEventListener('resize', this.renderer.resize);
        
        this.isInitialized = false;
        this.dataLoaded = false;
        
        console.log('Système de diagrammes détruit');
    }

    /*
     * MÉTHODE: getStatus()
     * DESCRIPTION: Retourne le statut actuel du système
     * RETOURNE: object - informations sur l'état du système
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            dataLoaded: this.dataLoaded,
            modalOpen: this.modalManager ? this.modalManager.isOpen : false,
            hasChart: this.renderer ? this.renderer.chart !== null : false
        };
    }
}