class DestinationRenderer {
    constructor() {
        this.selectedIndex = 0;
    }

    render(destinations) {
        const galleryHTML = `
            <div style="color: white; text-align: center;">
                <h3 style="margin-bottom: 2rem;">Choisissez votre destination</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    ${destinations.map((dest, index) => this.renderDestinationCard(dest, index)).join('')}
                </div>
            </div>
        `;
        return galleryHTML;
    }

    renderDestinationCard(destination, index) {
        return `
            <div class="destination-card" data-index="${index}" style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 0.5rem;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <img src="${destination.image}" alt="${destination.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;">
                <h4 style="color: white; margin-bottom: 0.5rem;">${destination.name}</h4>
                <p style="color: #D0D6F9; font-size: 0.9rem; margin-bottom: 1rem;">${destination.description.substring(0, 100)}...</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <span style="color: #D0D6F9; font-size: 0.8rem;">${destination.distance}</span>
                    <span style="color: #D0D6F9; font-size: 0.8rem;">${destination.travelTime}</span>
                </div>
                <button class="select-btn" style="
                    background: white;
                    color: #0B0D17;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.25rem;
                    cursor: pointer;
                    width: 100%;
                ">Sélectionner</button>
            </div>
        `;
    }

    bindEvents(destinations) {
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.destination-card');
            if (card) {
                const index = parseInt(card.dataset.index);
                this.emit('destination:selected', { index, destination: destinations[index] });
            }

            const selectBtn = e.target.closest('.select-btn');
            if (selectBtn) {
                const card = selectBtn.closest('.destination-card');
                const index = parseInt(card.dataset.index);
                this.emit('destination:confirmed', { index, destination: destinations[index] });
            }
        });
    }

    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}