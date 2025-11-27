/*
 * FICHIER: UniversalRenderer.js
 * DESCRIPTION: Renderer générique pour tous les types de galeries
 * 
 * RÔLE: Cette classe unique gère le rendu HTML pour destinations, crew et technology
 * en s'adaptant selon le type et la configuration.
 * 
 * UTILISATION:
 * 1. Créer une instance: const renderer = new UniversalRenderer('crew')
 * 2. Générer le HTML: renderer.render(data)
 * 3. Attacher les événements: renderer.bindEvents(data)
 */
class UniversalRenderer {
    constructor(type) {
        this.type = type; // 'destination', 'crew', ou 'technology'
        this.data = [];
        this.galleryContainer = null;
        
        // Configuration selon le type
        this.config = this.getConfig(type);
    }

    /*
     * MÉTHODE: getConfig()
     * DESCRIPTION: Retourne la configuration selon le type de renderer
     */
    getConfig(type) {
        const configs = {
            destination: {
                galleryTitle: 'Choisissez votre destination',
                galleryClass: 'destination-gallery',
                cardClass: 'destination-card',
                eventType: 'destination:confirmed',
                renderCard: this.renderDestinationCard.bind(this),
                itemKey: 'name' // clé pour l'identifiant
            },
            crew: {
                galleryTitle: 'Choisissez un membre d\'équipage',
                galleryClass: 'crew-gallery',
                cardClass: 'crew-card',
                eventType: 'crew:confirmed',
                renderCard: this.renderCrewCard.bind(this),
                itemKey: 'id'
            },
            technology: {
                galleryTitle: 'Choisissez une technologie',
                galleryClass: 'techno-gallery',
                cardClass: 'techno-card',
                eventType: 'technology:confirmed',
                renderCard: this.renderTechnoCard.bind(this),
                itemKey: 'id'
            }
        };
        
        return configs[type] || configs.destination;
    }

    /*
     * MÉTHODE: render()
     * DESCRIPTION: Génère le HTML complet de la galerie
     */
    render(data) {
        this.data = data;
        
        // Utiliser la grille appropriée selon le type
        const gridClass = this.type === 'destination' ? 'gallery-grid' : `${this.type}-gallery-grid`;
        
        const galleryHTML = `
            <div class="gallery">
                <h3>${this.config.galleryTitle}</h3>
                <div class="${gridClass}">
                    ${data.map(item => this.config.renderCard(item)).join('')}
                </div>
            </div>
        `;
        
        return galleryHTML;
    }

    /*
     * MÉTHODES DE RENDU SPÉCIFIQUES
     */
    
    renderDestinationCard(destination) {
        return `
            <div class="gallery-image-card" data-id="${destination.name}">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            </div>
        `;
    }

    renderCrewCard(member) {
        return `
            <div class="${this.config.cardClass}" data-id="${member.id}">
                <div class="${this.config.cardClass}-image">
                    <img src="${member.img}" alt="${member.name}" loading="lazy">
                </div>
                <div class="${this.config.cardClass}-info">
                    <h4>${member.role}</h4>
                    <h5>${member.name}</h5>
                    <p>${member.bio.substring(0, 100)}...</p>
                </div>
                <button class="${this.config.cardClass}-select" data-id="${member.id}">
                    Sélectionner
                </button>
            </div>
        `;
    }

    renderTechnoCard(tech) {
        return `
            <div class="${this.config.cardClass}" data-id="${tech.id}">
                <div class="${this.config.cardClass}-image">
                    <img src="${tech.img}" alt="${tech.name}" loading="lazy">
                </div>
                <div class="${this.config.cardClass}-info">
                    <h4>${tech.name}</h4>
                    <p>${tech.description.substring(0, 120)}...</p>
                </div>
                <button class="${this.config.cardClass}-select" data-id="${tech.id}">
                    Sélectionner
                </button>
            </div>
        `;
    }

    /*
     * MÉTHODE: bindEvents()
     * DESCRIPTION: Attache les écouteurs d'événements pour les interactions
     */
    bindEvents(data) {
        this.data = data;
        
        // Attendre que le DOM soit mis à jour
        setTimeout(() => {
            this.galleryContainer = document.querySelector('.gallery');
            if (!this.galleryContainer) return;

            // Événements sur les boutons de sélection (sauf pour destinations)
            if (this.type !== 'destination') {
                const selectButtons = this.galleryContainer.querySelectorAll(`.${this.type}-card-select`);
                selectButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const itemId = button.dataset.id;
                        this.handleSelection(itemId);
                    });
                });
            }

            // Événements sur les cartes
            const cardSelector = this.type === 'destination' ? '.gallery-image-card' : `.${this.type}-card`;
            const hoverClass = this.type === 'destination' ? 'gallery-image-card-hover' : `${this.type}-card-hover`;
            const selectedClass = this.type === 'destination' ? 'gallery-image-card-selected' : `${this.type}-card-selected`;
            
            const cards = this.galleryContainer.querySelectorAll(cardSelector);
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const itemId = card.dataset.id;
                    this.handleSelection(itemId);
                });

                // Effet de hover
                card.addEventListener('mouseenter', () => {
                    card.classList.add(hoverClass);
                });

                card.addEventListener('mouseleave', () => {
                    card.classList.remove(hoverClass);
                });
            });
        }, 100);
    }

    /*
     * MÉTHODE: handleSelection()
     * DESCRIPTION: Gère la sélection d'un élément
     */
    handleSelection(itemId) {
        const selectedItem = this.data.find(item => {
            if (this.type === 'destination') {
                return item.name === itemId;
            } else {
                return item.id === itemId;
            }
        });

        if (!selectedItem) return;

        // Effet visuel de sélection
        this.addSelectionEffect(itemId);

        // Émettre l'événement approprié
        const eventDetail = this.type === 'destination' 
            ? { destination: selectedItem }
            : { [this.type === 'crew' ? 'crew' : 'technology']: selectedItem };

        const event = new CustomEvent(this.config.eventType, {
            detail: eventDetail
        });
        document.dispatchEvent(event);
    }

    /*
     * MÉTHODE: addSelectionEffect()
     * DESCRIPTION: Ajoute un effet visuel quand un élément est sélectionné
     */
    addSelectionEffect(itemId) {
        if (!this.galleryContainer) return;

        // Utiliser les classes appropriées selon le type
        const cardSelector = this.type === 'destination' ? '.gallery-image-card' : `.${this.type}-card`;
        const selectedClass = this.type === 'destination' ? 'gallery-image-card-selected' : `${this.type}-card-selected`;

        // Retirer les sélections précédentes
        const previousSelections = this.galleryContainer.querySelectorAll(`.${selectedClass.replace('-selected', '-selected')}`);
        previousSelections.forEach(card => card.classList.remove(selectedClass));

        // Ajouter la nouvelle sélection
        const selectedCard = this.galleryContainer.querySelector(`[data-id="${itemId}"]`);
        if (selectedCard) {
            selectedCard.classList.add(selectedClass);
        }
    }
}

// Rendre la classe accessible globalement
window.UniversalRenderer = UniversalRenderer;