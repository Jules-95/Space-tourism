/*
 * FICHIER: DestinationRenderer.js
 * DESCRIPTION: Rendu HTML des destinations (Principe SOLID: Single Responsibility)
 * 
 * RÔLE: Cette classe a UNE SEULE responsabilité - créer le HTML des destinations.
 * Elle génère le code HTML pour afficher les icônes de planètes dans la galerie.
 * 
 * PRINCIPE SOLID APPLIQUÉ:
 * - Single Responsibility Principle (SRP): Ne gère QUE le rendu HTML
 * - Open/Closed Principle (OCP): Peut être étendue pour d'autres styles de rendu
 * 
 * UTILISATION:
 * 1. Créer une instance: const renderer = new DestinationRenderer()
 * 2. Générer le HTML: renderer.render(destinations)
 * 3. Attacher les événements: renderer.bindEvents(destinations)
 */
class DestinationRenderer {
    constructor() {
        this.selectedIndex = 0;  // Index de la destination sélectionnée
    }

    /*
     * MÉTHODE: render()
     * DESCRIPTION: Génère le HTML complet de la galerie
     * PARAMÈTRE: destinations - tableau des objets destination
     * RETOURNE: String - HTML complet de la galerie
     * 
     * STRUCTURE HTML CRÉÉE:
     * <div>
     *   <h3>Titre</h3>
     *   <div>conteneur flex avec les icônes</div>
     * </div>
     */
    render(destinations) {
        const galleryHTML = `
            <div style="color: white; text-align: center;">
                <h3 style="margin-bottom: 3rem;">Choisissez votre destination</h3>
                <style>
                    .destination-card:hover {
                        background: rgba(255, 255, 255, 0.1);
                        border-color: rgba(255, 255, 255, 0.5);
                        transform: scale(1.1);
                    }
                    .destination-card:hover img {
                        transform: scale(1.05);
                    }
                    .destination-card:hover .planet-name {
                        opacity: 1;
                        bottom: -20px;
                    }
                </style>
                <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; padding: 2rem 0;">
                    ${destinations.map((dest, index) => this.renderDestinationCard(dest, index)).join('')}
                </div>
            </div>
        `;
        return galleryHTML;
    }

    /*
     * MÉTHODE: renderDestinationCard()
     * DESCRIPTION: Génère le HTML d'une seule icône de destination
     * PARAMÈTRES: destination - objet destination, index - position dans le tableau
     * RETOURNE: String - HTML de l'icône
     * 
     * DESIGN DE L'ICÔNE:
     * - Cercle de 120px avec bordure
     * - Image de 80px au centre, également circulaire
     * - Nom de la planète en dessous
     * - Effets de survol CSS intégrés
     */
    renderDestinationCard(destination, index) {
        return `
            <div class="destination-card" data-index="${index}" style="
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 120px;
                height: 120px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            ">
                <img src="${destination.image}" alt="${destination.name}" style="
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                ">
                <div class="planet-name" style="
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    font-size: 0.8rem;
                    font-family: 'Barlow Condensed', sans-serif;
                    letter-spacing: 0.05rem;
                    opacity: 0.8;
                    white-space: nowrap;
                ">${destination.name}</div>
            </div>
        `;
    }

    /*
     * MÉTHODE: bindEvents()
     * DESCRIPTION: Attache les écouteurs d'événements pour les interactions
     * PARAMÈTRE: destinations - tableau des destinations pour les données
     * 
     * ÉVÉNEMENTS GÉRÉS:
     * - Clic sur une icône: émet 'destination:confirmed'
     * 
     * PATTERN: Event Delegation - un seul écouteur pour toutes les cartes
     */
    bindEvents(destinations) {
        document.addEventListener('click', (e) => {
            // Détecter si on clique sur une carte de destination
            const card = e.target.closest('.destination-card');
            if (card) {
                const index = parseInt(card.dataset.index);
                // Émettre l'événement de confirmation directe (plus besoin de bouton)
                this.emit('destination:confirmed', { index, destination: destinations[index] });
            }
        });
    }

    /*
     * MÉTHODE: emit()
     * DESCRIPTION: Émet un événement personnalisé pour la communication
     * PARAMÈTRES: eventName - nom de l'événement, data - données associées
     * 
     * PATTERN: Observer Pattern - permet la communication entre classes
     */
    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}