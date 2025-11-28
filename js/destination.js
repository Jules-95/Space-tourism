// Sélecteurs principaux
const buttons = document.querySelectorAll(".desti-btn");
const title = document.querySelector(".txt-destination h2");
const description = document.querySelector(".txt-destination p");
const image = document.querySelector(".img-lune img");
const distance = document.querySelector(".description-destination ul:nth-child(1) li:nth-child(2)");
const travelTime = document.querySelector(".description-destination ul:nth-child(2) li:nth-child(2)");
const moon3DBtn = document.getElementById("moon-3d-btn");

// Données des destinations
const destinations = [
  {
    name: "MOON",
    text: "See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
    img: "img/moon.png",
    distance: "384,400 KM",
    time: "3 DAYS"
  },
  {
    name: "MARS",
    text: "Don’t forget to pack your hiking boots! You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!",
    img: "img/mars.png",
    distance: "225 MIL. KM",
    time: "9 MONTHS"
  },
  {
    name: "EUROPA",
    text: "The smallest of the four Galilean moons orbiting Jupiter, Europa is a winter lover’s dream. With an icy surface, it’s perfect for a bit of ice skating, curling, hockey, or simple relaxation in your snug wintery cabin.",
    img: "img/europa.png",
    distance: "628 MIL. KM",
    time: "3 YEARS"
  },
  {
    name: "TITAN",
    text: "The only moon known to have a dense atmosphere other than Earth, Titan is a home away from home (just a few hundred degrees colder!). As a bonus, you get striking views of the Rings of Saturn.",
    img: "img/titan.png",
    distance: "1.6 BIL. KM",
    time: "7 YEARS"
  }
];

// Gestion du clic sur chaque bouton
buttons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    // 1️⃣ Reset des états
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // 2️⃣ Animation 3D et changement du contenu
    const dest = destinations[index];
    
    // Ajouter l'animation de changement
    image.classList.add("changing");
    
    // Changer le contenu après le début de l'animation
    setTimeout(() => {
      title.textContent = dest.name;
      description.textContent = dest.text;
      image.src = dest.img;
      distance.textContent = dest.distance;
      travelTime.textContent = dest.time;
      
      // Afficher/masquer le bouton Moon 3D
      if (dest.name === "MOON" && moon3DBtn) {
        moon3DBtn.style.display = "block";
      } else if (moon3DBtn) {
        moon3DBtn.style.display = "none";
      }
    }, 300);
    
    // Retirer la classe d'animation
    setTimeout(() => {
      image.classList.remove("changing");
    }, 600);
  });
});

// Initialiser l'état du bouton Moon 3D au chargement
document.addEventListener("DOMContentLoaded", () => {
  if (moon3DBtn) {
    moon3DBtn.style.display = "block"; // MOON est affiché par défaut
  }
});
