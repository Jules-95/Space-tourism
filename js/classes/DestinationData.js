/*
 * FICHIER: DestinationData.js
 * DESCRIPTION: Gestion des données des destinations (Principe SOLID: Single Responsibility)
 * 
 * RÔLE: Cette classe a UNE SEULE responsabilité - gérer les données des destinations.
 * Elle charge, stocke et fournit l'accès aux données du fichier JSON.
 * 
 * PRINCIPE SOLID APPLIQUÉ:
 * - Single Responsibility Principle (SRP): Ne gère QUE les données
 * - Open/Closed Principle (OCP): Peut être étendue pour d'autres sources de données
 * 
 * UTILISATION:
 * 1. Créer une instance: const dataManager = new DestinationData()
 * 2. Charger les données: await dataManager.load()
 * 3. Accéder aux données: dataManager.getAllDestinations()
 */
class DestinationData {
    constructor() {
        this.destinations = [];  // Stockage interne des destinations
        this.isLoaded = false;    // Flag pour suivre l'état du chargement
    }

    /*
     * MÉTHODE: load()
     * DESCRIPTION: Charge les données depuis le fichier JSON de manière asynchrone
     * PARAMÈTRE: jsonPath - chemin vers le fichier JSON (défaut: 'data/destinations.json')
     * RETOURNE: Promise<Array> - tableau des destinations
     * 
     * PROCESSUS:
     * 1. Fetch le fichier JSON
     * 2. Vérifier la réponse HTTP
     * 3. Parser les données
     * 4. Stocker dans this.destinations
     * 5. Émettre un événement 'data:loaded'
     */
    async load(jsonPath = 'data/destinations.json') {
        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            this.destinations = data.destinations;
            this.isLoaded = true;
            this.emit('data:loaded', this.destinations);
            return this.destinations;
        } catch (error) {
            console.error('Failed to load destinations:', error);
            this.emit('data:error', error);
            throw error;
        }
    }

    /*
     * MÉTHODE: getDestination()
     * DESCRIPTION: Récupère une destination spécifique par son index
     * PARAMÈTRE: index - position dans le tableau (0-based)
     * RETOURNE: Object - destination demandée
     * 
     * SÉCURITÉ: Vérifie que les données sont chargées avant d'accéder
     */
    getDestination(index) {
        if (!this.isLoaded) throw new Error('Data not loaded');
        return this.destinations[index];
    }

    /*
     * MÉTHODE: getAllDestinations()
     * DESCRIPTION: Retourne une copie de toutes les destinations
     * RETOURNE: Array - copie du tableau des destinations
     * 
     * SÉCURITÉ: Retourne une copie pour éviter les modifications externes
     */
    getAllDestinations() {
        if (!this.isLoaded) throw new Error('Data not loaded');
        return [...this.destinations];  // Copie superficielle pour protéger les données
    }

    /*
     * MÉTHODE: emit()
     * DESCRIPTION: Émet un événement personnalisé pour la communication inter-classes
     * PARAMÈTRES: eventName - nom de l'événement, data - données à transmettre
     * 
     * PATTERNE: Observer Pattern - permet aux autres classes d'écouter les changements
     */
    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}