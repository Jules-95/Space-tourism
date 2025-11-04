// === Sélecteurs ===
const buttons = document.querySelectorAll(".dot");
const role = document.querySelector(".crew-role");
const nameEl = document.querySelector(".crew-txt h3");
const bio = document.querySelector(".crew-txt p");
const image = document.querySelector(".picture-crew img");
const crewTxt = document.querySelector(".crew-txt");

let currentIndex = 0;

// === Données ===
const crewMembers = [
  {
    role: "COMMANDER",
    name: "DOUGLAS HURLEY",
    bio: "Douglas Gerald Hurley is an American engineer, former Marine Corps pilot and former NASA astronaut. He launched into space for the third time as commander of Crew Dragon Demo-2.",
    img: "img/douglas-d.png",
    class: "crew-douglas",
  },
  {
    role: "MISSION SPECIALIST",
    name: "MARK SHUTTLEWORTH",
    bio: "Mark Richard Shuttleworth is the founder and CEO of Canonical, the company behind the Linux-based Ubuntu operating system. Shuttleworth became the first South African to travel to space as a space tourist.",
    img: "img/mark.png",
    class: "crew-mark",
  },
  {
    role: "PILOT",
    name: "VICTOR GLOVER",
    bio: "Pilot on the first operational flight of the SpaceX Crew Dragon to the International Space Station. Glover is a commander in the U.S. Navy where he pilots an F/A-18. He was a crew member of Expedition 64, and served as a station systems flight engineer.",
    img: "img/victor.png",
    class: "crew-victor",
  },
  {
    role: "FLIGHT ENGINEER",
    name: "ANOUSHEH ANSARI",
    bio: "Anousheh Ansari is an Iranian American engineer and co-founder of Prodea Systems. Ansari was the fourth self-funded space tourist, the first self\u2011funded woman to fly to the ISS, and the first Iranian in space.",
    img: "img/anousheh.png",
    class: "crew-anousheh",
  },
];

// === Préchargement des images (évite les micro freezes sur mobile) ===
window.addEventListener("load", () => {
  crewMembers.forEach(member => {
    const img = new Image();
    img.src = member.img;
  });
});

// === Fonction centrale de navigation ===
function navigateCrew(targetIndex) {
  if (targetIndex === currentIndex || targetIndex < 0 || targetIndex >= crewMembers.length) return;

  const direction = targetIndex > currentIndex ? "right" : "left";
  currentIndex = targetIndex;

  // Actualise les points actifs
  buttons.forEach(btn => btn.classList.remove("active"));
  buttons[currentIndex].classList.add("active");

  // Animation de sortie
  crewTxt.classList.add("crew-slide", direction === "right" ? "out-left" : "out-right");
  image.classList.add("fade-out");

  // Précharger la nouvelle image
  const newImg = new Image();
  newImg.src = crewMembers[currentIndex].img;

  newImg.onload = () => {
    setTimeout(() => {
      // Mise à jour du texte
      role.textContent = crewMembers[currentIndex].role;
      nameEl.textContent = crewMembers[currentIndex].name;
      bio.innerHTML = crewMembers[currentIndex].bio;

      // Mise à jour de l'image
      image.className = "";
      image.classList.add(crewMembers[currentIndex].class);
      image.src = newImg.src;

      // 🔧 Force un reflow avant de lancer l’animation d’entrée (corrige mobile)
      crewTxt.classList.remove("out-left", "out-right");
      void crewTxt.offsetWidth;

      // Animation d'entrée (texte qui vient du bon côté)
      crewTxt.classList.add(direction === "right" ? "in-right" : "in-left");

      // Nettoyage après animation
      setTimeout(() => {
        crewTxt.classList.remove("in-right", "in-left");
        image.classList.remove("fade-out");
      }, 1000);
    }, 500);
  };
}

// === Gestion des clics uniquement ===
buttons.forEach((button, index) => {
  button.addEventListener("click", () => navigateCrew(index));
});
