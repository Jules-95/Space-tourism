/*
 * FICHIER: modal-gallery.js
 * DESCRIPTION: Point d'entrée de la galerie modale
 * 
 * RÔLE: Ce fichier est le POINT D'ENTRÉE principal de la galerie.
 * Il initialise tous les composants et connecte le bouton à la galerie.
 * 
 * ARCHITECTURE:
 * 1. Crée les instances des classes (Dependency Injection)
 * 2. Initialise la galerie
 * 3. Connecte l'interface utilisateur
 * 4. Rend la galerie accessible globalement pour le debug
 * 
 * FONCTIONNEMENT:
 * - Attend que le DOM soit chargé
 * - Crée les composants dans le bon ordre
 * - Attache le bouton "Galerie" à la fonctionnalité
 */

// Attendre que le DOM soit complètement chargé avant d'initialiser
document.addEventListener('DOMContentLoaded', () => {
    /*
     * ÉTAPE 1: Création des instances des classes
     * 
     * PATTERN: Dependency Injection
     * Chaque classe reçoit ses dépendances plutôt que de les créer elle-même
     * 
     * dataManager: gère le chargement des données JSON
     * modalManager: gère l'affichage de la fenêtre modale
     * renderer: gère la création du HTML des destinations
     */
    const dataManager = new DestinationData();
    const modalManager = new ModalManager();
    const renderer = new DestinationRenderer();
    
    /*
     * ÉTAPE 2: Création de la galerie principale
     * 
     * La classe DestinationGallery coordonne tous les autres composants.
     * Elle suit le principe de Dependency Inversion (DIP).
     */
    const gallery = new DestinationGallery(dataManager, modalManager, renderer);
    
    /*
     * ÉTAPE 3: Initialisation asynchrone
     * 
     * Charge les données et prépare la galerie.
     * Utilise async/await pour gérer le chargement asynchrone du JSON.
     */
    gallery.init();
    
    /*
     * ÉTAPE 4: Connexion de l'interface utilisateur
     * 
     * Recherche le bouton "Galerie" dans le DOM et attache l'événement click.
     * Le bouton a été ajouté dans destination.html.
     */
    const galleryButton = document.getElementById('gallery-btn');
    if (galleryButton) {
        galleryButton.addEventListener('click', () => {
            gallery.openGallery();
        });
    } else {
        console.warn('Gallery button not found in DOM');
    }
    
    /*
     * ÉTAPE 5: Accès global pour le développement
     * 
     * Rend la galerie accessible dans la console du navigateur
     * pour faciliter le debug et les tests manuels.
     * 
     * Usage dans la console:
     * - window.destinationGallery.openGallery() // Ouvre la galerie
     * - window.destinationGallery.destinations // Voir les données
     */
    window.destinationGallery = gallery;
    
    console.log('Modal gallery system initialized successfully');
});