class DestinationGallery {
    constructor(dataManager, modalManager, renderer) {
        this.dataManager = dataManager;
        this.modalManager = modalManager;
        this.renderer = renderer;
        this.destinations = [];
        
        this.bindEvents();
    }

    async init() {
        try {
            this.destinations = await this.dataManager.load();
            this.renderer.bindEvents(this.destinations);
            console.log('DestinationGallery initialized');
        } catch (error) {
            console.error('Failed to initialize:', error);
        }
    }

    openGallery() {
        if (this.destinations.length === 0) {
            console.error('No destinations loaded');
            return;
        }

        const galleryContent = this.renderer.render(this.destinations);
        this.modalManager.open(galleryContent);
    }

    bindEvents() {
        document.addEventListener('destination:confirmed', (e) => {
            const { destination } = e.detail;
            this.updateMainDestination(destination);
            this.modalManager.close();
        });
    }

    updateMainDestination(destination) {
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
}