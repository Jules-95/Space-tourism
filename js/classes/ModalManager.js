/*
 * FICHIER: ModalManager.js
 * DESCRIPTION: Gestion de la modal (Principe SOLID: Single Responsibility)
 * 
 * RÔLE: Cette classe a UNE SEULE responsabilité - gérer l'affichage de la modal.
 * Elle crée, ouvre, ferme et gère les interactions de la fenêtre modale.
 * 
 * PRINCIPE SOLID APPLIQUÉ:
 * - Single Responsibility Principle (SRP): Ne gère QUE la modal
 * - Open/Closed Principle (OCP): Peut être étendue avec de nouvelles options
 * 
 * UTILISATION:
 * 1. Créer une instance: const modalManager = new ModalManager()
 * 2. Ouvrir: modalManager.open(content)
 * 3. Fermer: modalManager.close()
 */
class ModalManager {
    constructor() {
        this.isOpen = false;        // État de la modal (ouverte/fermée)
        this.modalElement = null;   // Référence à l'élément DOM de la modal
        this.bindEvents();          // Attacher les écouteurs d'événements globaux
    }

/*
     * MÉTHODE: createModal()
     * DESCRIPTION: Crée la structure HTML de la modal et l'injecte dans le DOM
     * PARAMÈTRE: content - contenu HTML à afficher dans la modal
     * 
     * STRUCTURE HTML CRÉÉE:
     * <div class="modal-overlay"> (fond semi-transparent)
     *   <div class="modal-content"> (conteneur principal)
     *     <button class="modal-close">×</button> (bouton de fermeture)
     *     <div class="modal-filters"> (zone de filtres)
     *     <div class="modal-body"> (contenu personnalisé)
     *   </div>
     * </div>
     */
    createModal(content, filters = null) {
        // Création du fond derrière la modal (overlay)
        this.modalElement = document.createElement('div');
        this.modalElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        // Création du conteneur de contenu / agit sur le fond de la modale
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            background: #0B0D17;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 600px;
            max-height: 400px;
            overflow: auto;
            position: relative;
        `;
        
// Contenu HTML avec bouton de fermeture et filtres
        const filtersHtml = filters ? this.renderFilters(filters) : '';
        contentDiv.innerHTML = `
            <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
            ${filtersHtml}
            <div class="modal-body">${content}</div>
        `;
        
        // Assemblage et injection dans le DOM
        this.modalElement.appendChild(contentDiv);
        document.body.appendChild(this.modalElement);
        this.bindModalEvents();  // Attacher les événements spécifiques à cette modal
    }

/*
     * MÉTHODE: renderFilters()
     * DESCRIPTION: Génère le HTML pour les filtres
     * PARAMÈTRE: filters - configuration des filtres
     */
    renderFilters(filters) {
        return `
            <div class="modal-filters">
                <div class="filter-controls">
                    ${filters.type === 'destination' ? this.renderDestinationFilters() : ''}
                    ${filters.type === 'crew' ? this.renderCrewFilters() : ''}
                    ${filters.type === 'technology' ? this.renderTechnologyFilters() : ''}
                </div>
            </div>
        `;
    }

    /*
     * MÉTHODE: renderDestinationFilters()
     * DESCRIPTION: Génère les filtres pour destinations
     */
    renderDestinationFilters() {
        return `
            <div class="filter-group">
                <label>Filtrer par distance:</label>
                <select class="filter-select" data-filter="distance">
                    <option value="">Toutes</option>
                    <option value="close">Proches (&lt; 500M KM)</option>
                    <option value="medium">Moyennes (500M - 1B KM)</option>
                    <option value="far">Lointaines (&gt; 1B KM)</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Filtrer par temps de voyage:</label>
                <select class="filter-select" data-filter="travelTime">
                    <option value="">Tous</option>
                    <option value="short">Courts (&lt; 1 mois)</option>
                    <option value="medium">Moyens (1 mois - 1 an)</option>
                    <option value="long">Longs (&gt; 1 an)</option>
                </select>
            </div>
        `;
    }

    /*
     * MÉTHODE: renderCrewFilters()
     * DESCRIPTION: Génère les filtres pour crew
     */
    renderCrewFilters() {
        return `
            <div class="filter-group">
                <label>Filtrer par rôle:</label>
                <select class="filter-select" data-filter="role">
                    <option value="">Tous les rôles</option>
                    <option value="COMMANDER">Commandant</option>
                    <option value="PILOT">Pilote</option>
                    <option value="MISSION SPECIALIST">Spécialiste de mission</option>
                    <option value="FLIGHT ENGINEER">Ingénieur de vol</option>
                </select>
            </div>
        `;
    }

    /*
     * MÉTHODE: renderTechnologyFilters()
     * DESCRIPTION: Génère les filtres pour technology
     */
    renderTechnologyFilters() {
        return `
            <div class="filter-group">
                <label>Filtrer par type:</label>
                <select class="filter-select" data-filter="type">
                    <option value="">Tous les types</option>
                    <option value="vehicle">Véhicule de lancement</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="capsule">Capsule spatiale</option>
                </select>
            </div>
        `;
    }

    /*
     * MÉTHODE: open()
     * DESCRIPTION: Ouvre la modal avec le contenu spécifié
     * PARAMÈTRE: content - contenu HTML à afficher
     * PARAMÈTRE: filters - configuration des filtres (optionnel)
     * 
     * LOGIQUE:
     * - Si la modal n'existe pas, la créer
     * - Sinon, mettre à jour le contenu existant
     * - Changer l'état et émettre un événement
     */
    open(content, filters = null) {
        if (this.isOpen) return;  // Éviter les ouvertures multiples
        
if (!this.modalElement) {
            this.createModal(content, filters);
        } else {
            // Mettre à jour les filtres si fournis
            if (filters) {
                const filtersContainer = this.modalElement.querySelector('.modal-filters');
                if (filtersContainer) {
                    filtersContainer.innerHTML = this.renderFilters(filters);
                } else {
                    // Insérer les filtres avant le body
                    const body = this.modalElement.querySelector('.modal-body');
                    const filtersHtml = this.renderFilters(filters);
                    body.insertAdjacentHTML('beforebegin', filtersHtml);
                }
            }
            this.modalElement.querySelector('.modal-body').innerHTML = content;
            this.modalElement.style.display = 'flex';
        }
        
        this.isOpen = true;
        this.emit('modal:opened');
    }

    /*
     * MÉTHODE: close()
     * DESCRIPTION: Ferme la modal et nettoie l'état
     * 
     * LOGIQUE:
     * - Masquer la modal (display: none)
     * - Mettre à jour l'état
     * - Émettre un événement pour les autres classes
     */
    close() {
        if (!this.isOpen || !this.modalElement) return;
        
        this.isOpen = false;
        this.modalElement.style.display = 'none';
        this.emit('modal:closed');
    }

    /*
     * MÉTHODE: bindEvents()
     * DESCRIPTION: Attache les écouteurs d'événements globaux (clavier, etc.)
     * 
     * ÉVÉNEMENTS GÉRÉS:
     * - Escape: ferme la modal quand on appuie sur Échap
     */
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

/*
     * MÉTHODE: bindModalEvents()
     * DESCRIPTION: Attache les écouteurs d'événements spécifiques à la modal
     * 
     * ÉVÉNEMENTS GÉRÉS:
     * - Clic sur le bouton ×: ferme la modal
     * - Clic sur l'overlay: ferme la modal
     * - Changement de filtre: appliquer le filtre
     */
    bindModalEvents() {
        if (!this.modalElement) return;

        // Bouton de fermeture
        const closeBtn = this.modalElement.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Clic sur le fond (overlay)
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) this.close();
        });

        // Événements de filtre
        const filterSelects = this.modalElement.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.emit('modal:filter-changed', {
                    filterType: e.target.dataset.filter,
                    value: e.target.value
                });
            });
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
}