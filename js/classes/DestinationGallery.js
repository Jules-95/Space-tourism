/*
 * FICHIER: DestinationGallery.js
 * DESCRIPTION: Coordination de la galerie (Principe SOLID: Dependency Inversion)
 * 
 * RÔLE: Cette classe coordonne les autres composants de la galerie.
 * Elle ne dépend pas des implémentations concrètes mais des abstractions.
 * 
 * PRINCIPES SOLID APPLIQUÉS:
 * - Dependency Inversion Principle (DIP): Dépend des abstractions, pas des implémentations
 * - Single Responsibility Principle (SRP): Ne fait QUE de la coordination
 * 
 * UTILISATION:
 * 1. Créer les dépendances: dataManager, modalManager, renderer
 * 2. Créer la galerie: new DestinationGallery(dataManager, modalManager, renderer)
 * 3. Initialiser: await gallery.init()
 * 4. Ouvrir: gallery.openGallery()
 */
class DestinationGallery {
    /*
     * CONSTRUCTEUR: Injection des dépendances
     * PARAMÈTRES:
     * - dataManager: instance de DestinationData (gère les données)
     * - modalManager: instance de ModalManager (gère la modal)
     * - renderer: instance de DestinationRenderer (gère le rendu)
     * 
     * PATTERN: Dependency Injection - les dépendances sont fournies, pas créées ici
     */
    constructor(dataManager, modalManager, renderer) {
        this.dataManager = dataManager;    // Gestionnaire de données
        this.modalManager = modalManager;  // Gestionnaire de modal
        this.renderer = renderer;          // Gestionnaire de rendu
        this.destinations = [];            // Cache local des destinations
        
        this.bindEvents();  // Attacher les écouteurs d'événements
    }

    /*
     * MÉTHODE: init()
     * DESCRIPTION: Initialise la galerie en chargeant les données
     * RETOURNE: Promise<void>
     * 
     * PROCESSUS:
     * 1. Charger les données depuis le JSON
     * 2. Attacher les événements du renderer
     * 3. Logguer le succès
     */
    async init() {
        try {
            this.destinations = await this.dataManager.load();
            this.renderer.bindEvents(this.destinations);
            console.log('DestinationGallery initialized');
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }

    /*
     * MÉTHODE: openGallery()
     * DESCRIPTION: Ouvre la galerie dans la modal
     * 
     * PROCESSUS:
     * 1. Vérifier que les données sont chargées
     * 2. Générer le HTML de la galerie
     * 3. Ouvrir la modal avec ce contenu
     */
    openGallery() {
        if (this.destinations.length === 0) {
            console.error('No destinations loaded');
            return;
        }

        const galleryContent = this.renderer.render(this.destinations);
        this.modalManager.open(galleryContent);
    }

    /*
     * MÉTHODE: bindEvents()
     * DESCRIPTION: Attache les écouteurs pour la communication inter-composants
     * 
     * ÉVÉNEMENTS ÉCOUTÉS:
     * - destination:confirmed: quand l'utilisateur choisit une destination
     * - modal:closed: quand la modal se ferme (pour le nettoyage)
     */
    bindEvents() {
        // Écouter la sélection d'une destination
        document.addEventListener('destination:confirmed', (e) => {
            const { destination } = e.detail;
            this.handleDestinationSelection(destination);
        });

        // Écouter la fermeture de la modal (pour nettoyage)
        document.addEventListener('modal:closed', () => {
            this.cleanup();
        });
    }

    /*
     * MÉTHODE: handleDestinationSelection()
     * DESCRIPTION: Gère la sélection d'une destination par l'utilisateur
     * PARAMÈTRE: destination - objet destination sélectionnée
     * 
     * PROCESSUS:
     * 1. Mettre à jour la page principale
     * 2. Fermer la modal
     */
    handleDestinationSelection(destination) {
        this.updateMainDestination(destination);
        this.modalManager.close();
    }

    /*
     * MÉTHODE: updateMainDestination()
     * DESCRIPTION: Met à jour les éléments de la page destination.html
     * PARAMÈTRE: destination - nouvelle destination à afficher
     * 
     * ÉLÉMENTS MIS À JOUR:
     * - Titre (h2)
     * - Description (p)
     * - Image (img)
     * - Distance et temps de voyage
     * - Bouton actif dans la navigation
     */
    updateMainDestination(destination) {
        // Sélecteurs des éléments à mettre à jour
        const title = document.querySelector('.txt-destination h2');
        const description = document.querySelector('.txt-destination p');
        const image = document.querySelector('.img-lune img');
        const distance = document.querySelector('.description-destination ul:nth-child(1) li:nth-child(2)');
        const travelTime = document.querySelector('.description-destination ul:nth-child(2) li:nth-child(2)');
        const buttons = document.querySelectorAll('.desti-btn');

        // Mise à jour du contenu
        if (title) title.textContent = destination.name;
        if (description) description.textContent = destination.description;
        if (image) image.src = destination.image;
        if (distance) distance.textContent = destination.distance;
        if (travelTime) travelTime.textContent = destination.travelTime;

        // Mise à jour du bouton actif dans la navigation
        buttons.forEach((btn) => {
            btn.classList.toggle('active', 
                btn.textContent.trim().toLowerCase() === destination.name.toLowerCase());
        });
    }

    /*
     * MÉTHODE: cleanup()
     * DESCRIPTION: Nettoie les ressources temporaires
     * 
     * UTILITÉ: Prépare le système pour la prochaine ouverture
     */
    cleanup() {
        console.log('Gallery cleanup completed');
    }
}