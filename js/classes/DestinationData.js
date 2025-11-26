class DestinationData {
    constructor() {
        this.destinations = [];
        this.isLoaded = false;
    }

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

    getDestination(index) {
        if (!this.isLoaded) throw new Error('Data not loaded');
        return this.destinations[index];
    }

    getAllDestinations() {
        if (!this.isLoaded) throw new Error('Data not loaded');
        return [...this.destinations];
    }

    emit(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
}