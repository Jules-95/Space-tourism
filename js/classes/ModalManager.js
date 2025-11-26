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
     *     <div class="modal-body"> (contenu personnalisé)
     *   </div>
     * </div>
     */
    createModal(content) {
        // Création du fond de la modal (overlay)
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
        
        // Création du conteneur de contenu
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
        
        // Contenu HTML avec bouton de fermeture
        contentDiv.innerHTML = `
            <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
            <div class="modal-body">${content}</div>
        `;
        
        // Assemblage et injection dans le DOM
        this.modalElement.appendChild(contentDiv);
        document.body.appendChild(this.modalElement);
        this.bindModalEvents();  // Attacher les événements spécifiques à cette modal
    }

    /*
     * MÉTHODE: open()
     * DESCRIPTION: Ouvre la modal avec le contenu spécifié
     * PARAMÈTRE: content - contenu HTML à afficher
     * 
     * LOGIQUE:
     * - Si la modal n'existe pas, la créer
     * - Sinon, mettre à jour le contenu existant
     * - Changer l'état et émettre un événement
     */
    open(content) {
        if (this.isOpen) return;  // Éviter les ouvertures multiples
        
        if (!this.modalElement) {
            this.createModal(content);
        } else {
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
    }

    /*
     * MÉTHODE: emit()
     * DESCRIPTION: Émet un événement pour la communication inter-classes
     * PARAMÈTRE: eventName - nom de l'événement à émettre
     */
    emit(eventName) {
        const event = new CustomEvent(eventName);
        document.dispatchEvent(event);
    }
}