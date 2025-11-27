/*
 * FICHIER: DataManager.js
 * DESCRIPTION: Gestionnaire de données générique pour tous les types
 * 
 * RÔLE: Cette classe unique gère les données pour destinations, crew et technology
 * en chargeant le JSON approprié selon le type.
 * 
 * UTILISATION:
 * 1. Créer une instance: const dataManager = new DataManager('crew')
 * 2. Charger les données: await dataManager.load()
 */
class DataManager {
    constructor(type) {
        this.type = type; // 'destination', 'crew', ou 'technology'
        this.data = [];
        this.isLoaded = false;
        
        // Configuration selon le type
        this.config = this.getConfig(type);
    }

    /*
     * MÉTHODE: getConfig()
     * DESCRIPTION: Retourne la configuration selon le type de données
     */
    getConfig(type) {
        const configs = {
            destination: {
                jsonFile: 'data/destinations.json',
                dataPath: 'destinations', // chemin dans le JSON
                requiredFields: ['name', 'description', 'image', 'distance', 'travelTime']
            },
            crew: {
                jsonFile: 'data/crew.json',
                dataPath: null, // données directes
                requiredFields: ['id', 'role', 'name', 'bio', 'img', 'class']
            },
            technology: {
                jsonFile: 'data/technology.json',
                dataPath: null, // données directes
                requiredFields: ['id', 'name', 'description', 'img']
            }
        };
        
        return configs[type] || configs.destination;
    }

    /*
     * MÉTHODE: load()
     * DESCRIPTION: Charge les données depuis le JSON approprié
     */
    async load() {
        try {
            const response = await fetch(this.config.jsonFile);
            if (!response.ok) {
                throw new Error(`Failed to load ${this.config.jsonFile}`);
            }
            
            const jsonData = await response.json();
            
            // Extraire les données selon le chemin configuré
            if (this.config.dataPath) {
                this.data = jsonData[this.config.dataPath] || [];
            } else {
                this.data = Array.isArray(jsonData) ? jsonData : [];
            }
            
            // Valider et précharger
            this.data = this.validateData(this.data);
            await this.preloadImages();
            
            this.isLoaded = true;
            console.log(`Loaded ${this.type} data:`, this.data);
            
            return this.data;
        } catch (error) {
            console.error(`Failed to load ${this.type} data:`, error);
            throw error;
        }
    }

    /*
     * MÉTHODE: validateData()
     * DESCRIPTION: Valide la structure des données
     */
    validateData(data) {
        if (!Array.isArray(data)) {
            console.warn(`Data for ${this.type} is not an array`);
            return [];
        }
        
        return data.filter(item => {
            const isValid = this.config.requiredFields.every(field => item[field]);
            if (!isValid) {
                console.warn(`Invalid ${this.type} item:`, item);
            }
            return isValid;
        });
    }

    /*
     * MÉTHODE: preloadImages()
     * DESCRIPTION: Précharge toutes les images pour optimiser les performances
     */
    async preloadImages() {
        const imagePromises = this.data.map(item => {
            const imageUrl = this.type === 'destination' ? item.image : item.img;
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
            });
        });

        try {
            await Promise.all(imagePromises);
        } catch (error) {
            console.warn(`Some images failed to preload for ${this.type}:`, error);
        }
    }

    /*
     * MÉTHODE: findById()
     * DESCRIPTION: Trouve un élément par son ID
     */
    findById(id) {
        return this.data.find(item => {
            if (this.type === 'destination') {
                return item.name === id;
            } else {
                return item.id === id;
            }
        }) || null;
    }

    /*
     * MÉTHODE: getAll()
     * DESCRIPTION: Retourne une copie de toutes les données
     */
    getAll() {
        if (!this.isLoaded) {
            throw new Error(`Data not loaded for ${this.type}`);
        }
        return [...this.data];
    }
}

// Rendre la classe accessible globalement
window.DataManager = DataManager;