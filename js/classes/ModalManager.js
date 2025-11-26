class ModalManager {
    constructor() {
        this.isOpen = false;
        this.modalElement = null;
        this.bindEvents();
    }

    createModal(content) {
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
        
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            background: #0B0D17;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
        `;
        contentDiv.innerHTML = `
            <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
            <div class="modal-body">${content}</div>
        `;
        
        this.modalElement.appendChild(contentDiv);
        document.body.appendChild(this.modalElement);
        this.bindModalEvents();
    }

    open(content) {
        if (this.isOpen) return;
        
        if (!this.modalElement) {
            this.createModal(content);
        } else {
            this.modalElement.querySelector('.modal-body').innerHTML = content;
            this.modalElement.style.display = 'flex';
        }
        
        this.isOpen = true;
        this.emit('modal:opened');
    }

    close() {
        if (!this.isOpen || !this.modalElement) return;
        
        this.isOpen = false;
        this.modalElement.style.display = 'none';
        this.emit('modal:closed');
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    bindModalEvents() {
        if (!this.modalElement) return;

        const closeBtn = this.modalElement.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) this.close();
        });
    }

    emit(eventName) {
        const event = new CustomEvent(eventName);
        document.dispatchEvent(event);
    }
}