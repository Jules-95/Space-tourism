document.addEventListener('DOMContentLoaded', () => {
    const dataManager = new DestinationData();
    const modalManager = new ModalManager();
    const renderer = new DestinationRenderer();
    
    const gallery = new DestinationGallery(dataManager, modalManager, renderer);
    
    gallery.init();
    
    const galleryButton = document.getElementById('gallery-btn');
    if (galleryButton) {
        galleryButton.addEventListener('click', () => {
            gallery.openGallery();
        });
    }
    
    window.destinationGallery = gallery;
});