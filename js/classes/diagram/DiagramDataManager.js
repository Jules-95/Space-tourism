/*
 * FICHIER: DiagramDataManager.js
 * DESCRIPTION: Gestion des données pour diagrammes (Principe SOLID: Single Responsibility)
 * 
 * RÔLE: Cette classe a UNE SEULE responsabilité - gérer les données des destinations pour les diagrammes.
 * Elle charge, traite et formate les données de travelTime pour les visualisations.
 * 
 * PRINCIPE SOLID APPLIQUÉ:
 * - Single Responsibility Principle (SRP): Ne gère QUE les données de destinations
 * - Open/Closed Principle (OCP): Peut être étendue avec de nouvelles sources de données
 * 
 * UTILISATION:
 * 1. Créer une instance: const dataManager = new DiagramDataManager()
 * 2. Charger les données: await dataManager.loadDestinationData()
 * 3. Obtenir les données formatées: dataManager.getTravelTimeData()
 */
class DiagramDataManager {
    constructor() {
        this.destinationData = null;  // Données brutes des destinations
        this.processedData = null;   // Données traitées pour les diagrammes
    }

    /*
     * MÉTHODE: loadDestinationData()
     * DESCRIPTION: Charge les données depuis le fichier destinations.json
     * RETOURNE: Promise - résolue quand les données sont chargées
     */
    async loadDestinationData() {
        try {
            const response = await fetch('data/destinations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.destinationData = data.destinations;
            this.processTravelTimeData();
            return this.destinationData;
        } catch (error) {
            console.error('Erreur lors du chargement des données de destinations:', error);
            throw error;
        }
    }

    /*
     * MÉTHODE: processTravelTimeData()
     * DESCRIPTION: Traite les données de travelTime pour les rendre utilisables dans les diagrammes
     * 
     * LOGIQUE:
     * - Convertit les temps textuels en valeurs numériques (en jours)
     * - Crée un format de données compatible avec C3/D3
     * - Extrait les noms des destinations pour les labels
     */
    processTravelTimeData() {
        if (!this.destinationData) return;

        this.processedData = this.destinationData.map(destination => {
            const travelTimeText = destination.travelTime;
            const travelTimeInDays = this.convertTravelTimeToDays(travelTimeText);
            
            return {
                name: destination.name,
                travelTimeText: travelTimeText,
                travelTimeInDays: travelTimeInDays,
                id: destination.id
            };
        });
    }

    /*
     * MÉTHODE: convertTravelTimeToDays()
     * DESCRIPTION: Convertit le texte de travelTime en nombre de jours
     * PARAMÈTRE: travelTimeText - texte comme "3 DAYS", "9 MONTHS", "3 YEARS"
     * RETOURNE: number - nombre de jours équivalent
     * 
     * CONVERSIONS:
     * - DAYS: valeur directe
     * - MONTHS: valeur * 30 (approximation)
     * - YEARS: valeur * 365
     */
    convertTravelTimeToDays(travelTimeText) {
        const parts = travelTimeText.split(' ');
        const value = parseInt(parts[0]);
        const unit = parts[1];

        switch (unit) {
            case 'DAYS':
                return value;
            case 'MONTHS':
                return value * 30;  // Approximation: 1 mois = 30 jours
            case 'YEARS':
                return value * 365; // Approximation: 1 an = 365 jours
            default:
                return 0;
        }
    }

    /*
     * MÉTHODE: getTravelTimeData()
     * DESCRIPTION: Retourne les données formatées pour C3.js
     * RETOURNE: object - données au format C3
     * 
     * FORMAT C3:
     * {
     *   columns: [
     *     ['data', valeur1, valeur2, ...],
     *     ['names', 'NOM1', 'NOM2', ...]
     *   ]
     * }
     */
    getTravelTimeData() {
        if (!this.processedData) {
            console.warn('Les données n\'ont pas été traitées. Appelez loadDestinationData() d\'abord.');
            return null;
        }

        const travelTimes = this.processedData.map(item => item.travelTimeInDays);
        const names = this.processedData.map(item => item.name);

        return {
            columns: [
                ['travelTime', ...travelTimes],
                ['names', ...names]
            ],
            type: 'bar'
        };
    }

    /*
     * MÉTHODE: getTravelTimeDataForD3()
     * DESCRIPTION: Retourne les données formatées pour D3.js
     * RETOURNE: array - tableau d'objets au format D3
     * 
     * FORMAT D3:
     * [
     *   { name: 'MOON', value: 3, textValue: '3 DAYS' },
     *   { name: 'MARS', value: 270, textValue: '9 MONTHS' },
     *   ...
     * ]
     */
    getTravelTimeDataForD3() {
        if (!this.processedData) {
            console.warn('Les données n\'ont pas été traitées. Appelez loadDestinationData() d\'abord.');
            return null;
        }

        return this.processedData.map(item => ({
            name: item.name,
            value: item.travelTimeInDays,
            textValue: item.travelTimeText,
            id: item.id
        }));
    }

    /*
     * MÉTHODE: getDestinationById()
     * DESCRIPTION: Retourne les données d'une destination spécifique
     * PARAMÈTRE: id - identifiant de la destination
     * RETOURNE: object - données de la destination ou null
     */
    getDestinationById(id) {
        if (!this.processedData) return null;
        return this.processedData.find(item => item.id === id) || null;
    }

    /*
     * MÉTHODE: getAllDestinations()
     * DESCRIPTION: Retourne toutes les données traitées
     * RETOURNE: array - tableau des destinations traitées
     */
    getAllDestinations() {
        return this.processedData || [];
    }

    /*
     * MÉTHODE: getSortedByTravelTime()
     * DESCRIPTION: Retourne les destinations triées par temps de voyage
     * PARAMÈTRE: ascending - true pour ordre croissant, false pour décroissant
     * RETOURNE: array - destinations triées
     */
    getSortedByTravelTime(ascending = true) {
        if (!this.processedData) return [];
        
        const sorted = [...this.processedData].sort((a, b) => {
            return ascending ? 
                a.travelTimeInDays - b.travelTimeInDays : 
                b.travelTimeInDays - a.travelTimeInDays;
        });
        
        return sorted;
    }
}