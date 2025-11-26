# Galerie Modale - Architecture SOLID

## 📁 Structure des fichiers créés

### 🗂️ Dossiers
```
data/                    # Données externes
├── destinations.json     # Base de données des destinations

js/classes/              # Classes SOLID
├── DestinationData.js    # SRP: Gestion des données
├── ModalManager.js       # SRP: Gestion de la modal
├── DestinationRenderer.js # SRP: Rendu HTML
└── DestinationGallery.js  # DIP: Coordination

js/                      # Point d'entrée
└── modal-gallery.js       # Initialisation du système
```

## 🏗️ Architecture SOLID expliquée

### 1. Single Responsibility Principle (SRP)
Chaque classe a **UNE SEULE** responsabilité :

- **DestinationData** : Uniquement gérer les données
- **ModalManager** : Uniquement gérer la modal
- **DestinationRenderer** : Uniquement créer le HTML
- **DestinationGallery** : Uniquement coordonner les autres

### 2. Open/Closed Principle (OCP)
Le système est **ouvert** pour l'extension mais **fermé** pour la modification :

- On peut ajouter de nouvelles sources de données sans modifier DestinationData
- On peut créer de nouveaux styles de rendu sans modifier DestinationRenderer
- On peut ajouter de nouvelles options de modal sans modifier ModalManager

### 3. Liskov Substitution Principle (LSP)
Toutes les classes peuvent être **substituées** par leurs interfaces :

- DestinationGallery fonctionne avec n'importe quelle implémentation des interfaces
- Les dépendances sont injectées, pas créées en dur

### 4. Interface Segregation Principle (ISP)
Les interfaces sont **spécifiques** et petites :

- Pas de dépendances inutiles entre les classes
- Chaque classe ne dépend que de ce dont elle a besoin

### 5. Dependency Inversion Principle (DIP)
Les classes dépendent des **abstractions**, pas des implémentations :

- DestinationGallery dépend des interfaces, pas des classes concrètes
- Les dépendances sont injectées dans le constructeur

## 🔄 Flux de fonctionnement

### 1. Initialisation (modal-gallery.js)
```javascript
1. Crée les instances des classes (Dependency Injection)
2. Initialise la galerie (charge les données)
3. Connecte le bouton "Galerie"
4. Rend la galerie accessible globalement
```

### 2. Chargement des données (DestinationData)
```javascript
1. Fetch le fichier JSON
2. Parse les données
3. Stocke dans this.destinations
4. Émet l'événement 'data:loaded'
```

### 3. Ouverture de la galerie (DestinationGallery)
```javascript
1. Vérifie que les données sont chargées
2. Demande au renderer de générer le HTML
3. Demande au modalManager d'ouvrir la modal
```

### 4. Rendu HTML (DestinationRenderer)
```javascript
1. Génère le HTML des icônes circulaires
2. Applique les styles CSS intégrés
3. Crée les effets de survol
```

### 5. Interaction utilisateur
```javascript
1. Clic sur une icône → Émet 'destination:confirmed'
2. DestinationGallery reçoit l'événement
3. Met à jour la page principale
4. Ferme la modal
```

## 🎨 Design de la galerie

### Icônes de planètes
- **Taille**: 120px de diamètre
- **Image**: 80px circulaire au centre
- **Style**: Fond semi-transparent avec bordure
- **Hover**: Grossissement et brillance

### Modal
- **Dimensions**: 600x400px max
- **Fond**: Semi-transparent (rgba(0,0,0,0.8))
- **Contenu**: Fond sombre (#0B0D17)
- **Fermeture**: ESC, clic extérieur, bouton ×

## 📡 Communication entre classes

### Événements personnalisés
```javascript
'data:loaded'      → Les données sont chargées
'data:error'        → Erreur de chargement
'modal:opened'     → Modal ouverte
'modal:closed'     → Modal fermée
'destination:confirmed' → Destination choisie
```

### Pattern Observer
- Les classes émettent des événements
- Les autres classes écoutent ces événements
- Communication découplée et flexible

## 🛠️ Comment modifier le système

### Ajouter une destination
1. Modifier `data/destinations.json`
2. Ajouter un nouvel objet avec id, name, description, image, distance, travelTime

### Changer le style des icônes
1. Modifier `renderDestinationCard()` dans `DestinationRenderer.js`
2. Ajuster les CSS inline pour le nouveau design

### Ajouter une animation
1. Modifier `open()` ou `close()` dans `ModalManager.js`
2. Ajouter des transitions CSS ou JavaScript

### Changer la source de données
1. Créer une nouvelle classe qui implémente les mêmes méthodes
2. Injecter cette nouvelle classe dans `modal-gallery.js`

## 🐛 Debug et développement

### Accès depuis la console
```javascript
window.destinationGallery.openGallery()     // Ouvre la galerie
window.destinationGallery.destinations      // Voir les données
window.destinationGallery.modalManager     // Accès à la modal
window.destinationGallery.renderer         // Accès au renderer
```

### Logs importants
- "DestinationGallery initialized" → Système prêt
- "Gallery cleanup completed" → Nettoyage effectué
- "Modal gallery system initialized successfully" → Tout est OK

## 🎯 Points clés pour un développeur junior

1. **Séparation des responsabilités** : Chaque fichier fait une chose
2. **Communication par événements** : Pas d'appels directs entre classes
3. **Injection de dépendances** : Les classes reçoivent ce dont elles ont besoin
4. **Asynchrone** : Le chargement des données est non-bloquant
5. **Extensibilité** : Facile à ajouter de nouvelles fonctionnalités

Cette architecture est un excellent exemple de code maintenable, testable et évolutif !