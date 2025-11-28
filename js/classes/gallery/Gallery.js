/*
 * FICHIER: Gallery.js
 * DESCRIPTION: Classe de galerie mutualisée pour toutes les pages
 * 
 * RÔLE: Cette classe unique gère les galeries pour destinations, crew et technology
 * en lisant le JSON approprié selon la page actuelle.
 * 
 * UTILISATION:
 * 1. Créer une instance: const gallery = new Gallery('crew')
 * 2. Initialiser: await gallery.init()
 * 3. Ouvrir: gallery.openGallery()
 */
class Gallery {
constructor(type) {
        console.log(`Gallery constructor called with type: ${type}`);
        this.type = type; // 'destination', 'crew', ou 'technology'
        this.data = [];
        this.filteredData = [];
        this.modalManager = null;
        this.activeFilters = {};
        
        // Configuration selon le type
        this.config = this.getConfig(type);
        
        this.init();
    }

    /*
     * MÉTHODE: getConfig()
     * DESCRIPTION: Retourne la configuration selon le type de galerie
     */
    getConfig(type) {
        const configs = {
            destination: {
                jsonFile: 'data/destinations.json',
                eventType: 'destination:confirmed',
                galleryTitle: 'PICK YOUR DESTINATION',
                updateFunction: this.updateDestination.bind(this)
            },
            crew: {
                jsonFile: 'data/crew.json',
                eventType: 'crew:confirmed',
                galleryTitle: 'MEET YOUR CREW',
                updateFunction: this.updateCrew.bind(this)
            },
            technology: {
                jsonFile: 'data/technology.json',
                eventType: 'technology:confirmed',
                galleryTitle: 'Choisissez une technologie',
                updateFunction: this.updateTechnology.bind(this)
            }
        };
        
        return configs[type] || configs.destination;
    }

    /*
     * MÉTHODE: init()
     * DESCRIPTION: Initialise la galerie
     */
    async init() {
        try {
            // Charger les données
            await this.loadData();
            
            // Créer le modal manager
            this.modalManager = new ModalManager();
            
            // Attacher les événements
            this.bindEvents();
            
            console.log(`${this.type} gallery initialized`);
        } catch (error) {
            console.error(`Failed to initialize ${this.type} gallery:`, error);
        }
    }

    /*
     * MÉTHODE: loadData()
     * DESCRIPTION: Charge les données depuis le JSON
     */
    async loadData() {
        const response = await fetch(this.config.jsonFile);
        if (!response.ok) {
            throw new Error(`Failed to load ${this.config.jsonFile}`);
        }
        const jsonData = await response.json();
        
        // Extraire le tableau des données selon le type
        if (this.type === 'destination') {
            this.data = jsonData.destinations || jsonData;
        } else {
            this.data = jsonData; // crew et technology sont directement des tableaux
        }
        
        console.log(`Loaded ${this.type} data:`, this.data);
    }

/*
     * MÉTHODE: openGallery()
     * DESCRIPTION: Ouvre la galerie dans une modal
     */
    async openGallery() {
        console.log(`Opening ${this.type} gallery...`);
        console.log('Current data:', this.data);
        
        // Si les données ne sont pas chargées, les charger maintenant
        if (!this.data || this.data.length === 0) {
            console.log('Loading data now...');
            try {
                await this.loadData();
                console.log('Data loaded successfully:', this.data);
            } catch (error) {
                console.error('Failed to load data:', error);
                return;
            }
        }
        
        if (!this.data || this.data.length === 0) {
            console.error('Still no data after loading');
            return;
        }

        // Initialiser les données filtrées
        this.filteredData = [...this.data];
        this.activeFilters = {};

        const galleryContent = this.renderGallery();
        console.log('Gallery content rendered');
        
        // Configuration des filtres
        const filters = { type: this.type };
        
        this.modalManager.open(galleryContent, filters);
        
        
        // Attacher les événements aux cartes après le rendu
        this.bindCardEvents();
    }

/*
     * MÉTHODE: renderGallery()
     * DESCRIPTION: Génère le HTML de la galerie (uniquement des images)
     */
    renderGallery() {
        console.log('Rendering gallery with filtered data:', this.filteredData);
        console.log('Data type:', typeof this.filteredData);
        console.log('Is array?', Array.isArray(this.filteredData));
        
        if (!Array.isArray(this.filteredData)) {
            console.error('Filtered data is not an array:', this.filteredData);
            return '<div class="gallery"><h3>Erreur: données non valides</h3></div>';
        }
        
        return `
            <div class="gallery">
                <h3>${this.config.galleryTitle}</h3>
                <div class="gallery-grid">
                    ${this.filteredData.map(item => this.renderImageCard(item)).join('')}
                </div>
            </div>
        `;
    }

    /*
     * MÉTHODE: renderImageCard()
     * DESCRIPTION: Génère une carte avec uniquement une image cliquable
     */
    renderImageCard(item) {
        const imageUrl = this.type === 'destination' ? item.image : item.img;
        const itemId = this.type === 'destination' ? item.name : item.id;
        
        return `
            <div class="gallery-image-card" data-id="${itemId}">
                <img src="${imageUrl}" alt="${this.type === 'destination' ? item.name : (item.name || item.role)}" loading="lazy">
            </div>
        `;
    }

/*
     * MÉTHODE: bindEvents()
     * DESCRIPTION: Attache les écouteurs d'événements
     */
    bindEvents() {
        // Écouter la sélection dans la galerie
        document.addEventListener(this.config.eventType, (e) => {
            const { item } = e.detail;
            this.config.updateFunction(item);
            this.modalManager.close();
        });

        // Écouter les changements de filtre
        document.addEventListener('modal:filter-changed', (e) => {
            const { filterType, value } = e.detail;
            this.applyFilter(filterType, value);
        });

        // Écouter la fermeture de la modal
        document.addEventListener('modal:closed', () => {
            this.cleanup();
        });
    }

    /*
     * MÉTHODE: bindCardEvents()
     * DESCRIPTION: Attache les événements aux cartes d'images (appelé après rendu)
     */
    bindCardEvents() {
        setTimeout(() => {
            const cards = document.querySelectorAll('.gallery-image-card');
            cards.forEach(card => {
                const itemId = card.dataset.id;

                // Clic sur l'image
                card.addEventListener('click', () => {
                    this.handleSelection(itemId);
                });

                // Effet hover
                card.addEventListener('mouseenter', () => {
                    card.classList.add('gallery-image-card-hover');
                });

                card.addEventListener('mouseleave', () => {
                    card.classList.remove('gallery-image-card-hover');
                });
            });
        }, 100);
    }

/*
     * MÉTHODE: handleSelection()
     * DESCRIPTION: Gère la sélection d'un élément
     */
    handleSelection(itemId) {
        const selectedItem = this.filteredData.find(item => {
            if (this.type === 'destination') {
                return item.name === itemId;
            } else {
                return item.id === itemId;
            }
        });

        if (!selectedItem) return;

        // Effet visuel
        this.addSelectionEffect(itemId);

        // Émettre l'événement
        const event = new CustomEvent(this.config.eventType, {
            detail: { item: selectedItem }
        });
        document.dispatchEvent(event);
    }

    /*
     * MÉTHODE: addSelectionEffect()
     * DESCRIPTION: Ajoute un effet visuel de sélection
     */
    addSelectionEffect(itemId) {
        // Retirer les sélections précédentes
        const previousSelections = document.querySelectorAll('.gallery-image-card-selected');
        previousSelections.forEach(card => card.classList.remove('gallery-image-card-selected'));

        // Ajouter la nouvelle sélection
        const selectedCard = document.querySelector(`[data-id="${itemId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('gallery-image-card-selected');
        }
    }

    /*
     * MÉTHODES DE MISE À JOUR SPÉCIFIQUES
     */
    updateDestination(destination) {
        const title = document.querySelector('.txt-destination h2');
        const description = document.querySelector('.txt-destination p');
        const image = document.querySelector('.img-lune img');
        const distance = document.querySelector('.description-destination ul:nth-child(1) li:nth-child(2)');
        const travelTime = document.querySelector('.description-destination ul:nth-child(2) li:nth-child(2)');
        const buttons = document.querySelectorAll('.desti-btn');

        if (title) title.textContent = destination.name;
        if (description) description.textContent = destination.description;
        if (image) image.src = destination.image;
        if (distance) distance.textContent = destination.distance;
        if (travelTime) travelTime.textContent = destination.travelTime;

        buttons.forEach((btn) => {
            btn.classList.toggle('active', 
                btn.textContent.trim().toLowerCase() === destination.name.toLowerCase());
        });
    }

    updateCrew(crew) {
        const role = document.querySelector('.crew-role');
        const name = document.querySelector('.crew-txt h3');
        const bio = document.querySelector('.crew-txt p');
        const image = document.querySelector('.picture-crew img');
        const dots = document.querySelectorAll('.dot');

        if (role) role.textContent = crew.role;
        if (name) name.textContent = crew.name;
        if (bio) bio.textContent = crew.bio;
        if (image) {
            image.src = crew.img;
            image.alt = crew.name;
            image.className = crew.class;
        }

        dots.forEach((dot, index) => {
            const isActive = index === this.data.findIndex(member => member.id === crew.id);
            dot.classList.toggle('active', isActive);
        });
    }

    updateTechnology(technology) {
        const name = document.querySelector('.techno-txt h3');
        const description = document.querySelector('.techno-txt p');
        const image = document.querySelector('.techno-img img');
        const buttons = document.querySelectorAll('.techno-btn');

        if (name) name.textContent = technology.name;
        if (description) description.textContent = technology.description;
        if (image) {
            image.src = technology.img;
            image.alt = technology.name;
        }

        buttons.forEach((btn, index) => {
            const isActive = index === this.data.findIndex(tech => tech.id === technology.id);
            btn.classList.toggle('active', isActive);
        });
    }

/*
     * MÉTHODE: applyFilter()
     * DESCRIPTION: Applique un filtre aux données
     */
    applyFilter(filterType, value) {
        console.log(`Applying filter: ${filterType} = ${value}`);
        
        // Mettre à jour les filtres actifs
        this.activeFilters[filterType] = value;
        
        // Réinitialiser les données filtrées
        this.filteredData = [...this.data];
        
        // Appliquer tous les filtres actifs
        Object.entries(this.activeFilters).forEach(([type, filterValue]) => {
            if (filterValue) {
                this.filteredData = this.filterData(this.filteredData, type, filterValue);
            }
        });
        
        console.log('Filtered data:', this.filteredData);
        
        // Mettre à jour le rendu
        this.updateGalleryRender();
    }

    /*
     * MÉTHODE: filterData()
     * DESCRIPTION: Filtre les données selon le type et la valeur
     */
    filterData(data, filterType, value) {
        switch (this.type) {
            case 'destination':
                return this.filterDestinations(data, filterType, value);
            case 'crew':
                return this.filterCrew(data, filterType, value);
            case 'technology':
                return this.filterTechnology(data, filterType, value);
            default:
                return data;
        }
    }

    /*
     * MÉTHODE: filterDestinations()
     * DESCRIPTION: Filtre les destinations
     */
    filterDestinations(data, filterType, value) {
        return data.filter(item => {
            if (filterType === 'distance') {
                const distance = item.distance;
                switch (value) {
                    case 'close':
                        return distance.includes('384,400');
                    case 'medium':
                        return distance.includes('225 MIL') || distance.includes('628 MIL');
                    case 'far':
                        return distance.includes('1.6 BIL');
                    default:
                        return true;
                }
            } else if (filterType === 'travelTime') {
                const travelTime = item.travelTime;
                switch (value) {
                    case 'short':
                        return travelTime.includes('3 DAYS');
                    case 'medium':
                        return travelTime.includes('9 MONTHS');
                    case 'long':
                        return travelTime.includes('3 YEARS') || travelTime.includes('7 YEARS');
                    default:
                        return true;
                }
            }
            return true;
        });
    }

    /*
     * MÉTHODE: filterCrew()
     * DESCRIPTION: Filtre l'équipage
     */
    filterCrew(data, filterType, value) {
        if (filterType === 'role') {
            return data.filter(item => item.role === value);
        }
        return data;
    }

    /*
     * MÉTHODE: filterTechnology()
     * DESCRIPTION: Filtre les technologies
     */
    filterTechnology(data, filterType, value) {
        if (filterType === 'type') {
            return data.filter(item => {
                switch (value) {
                    case 'vehicle':
                        return item.id === 'launch-vehicle';
                    case 'infrastructure':
                        return item.id === 'spaceport';
                    case 'capsule':
                        return item.id === 'space-capsule';
                    default:
                        return true;
                }
            });
        }
        return data;
    }

    /*
     * MÉTHODE: updateGalleryRender()
     * DESCRIPTION: Met à jour le rendu de la galerie après filtrage
     */
    updateGalleryRender() {
        const galleryBody = document.querySelector('.modal-body .gallery');
        if (galleryBody) {
            const newContent = this.renderGallery();
            galleryBody.innerHTML = newContent;
            
            // Re-attacher les événements aux cartes
            this.bindCardEvents();
        }
    }

    /*
     * MÉTHODE: cleanup()
     * DESCRIPTION: Nettoyage des ressources
     */
    cleanup() {
        console.log(`${this.type} gallery cleanup completed`);
        this.filteredData = [];
        this.activeFilters = {};
    }
}

// Rendre la classe accessible globalement
window.Gallery = Gallery;