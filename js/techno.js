const buttons = document.querySelectorAll(".techno-btn");
const title = document.querySelector(".techno-txt h3");
const text = document.querySelector(".techno-txt p");
const image = document.querySelector(".techno-img img");
const technoTxt = document.querySelector(".contenu-techno");
const technoImg = document.querySelector(".techno-img img");

const technologies = [
  {
    name: "LAUNCH VEHICLE",
    description:
      "A launch vehicle or carrier rocket is a rocket-propelled vehicle used to carry a payload from Earth's surface to space, usually to Earth orbit or beyond. Our WEB-X carrier rocket is the most powerful in operation. Standing 150 metres tall, it's quite an awe-inspiring sight on the launch pad!",
    img: "img/launch.webp",
  },
  {
    name: "SPACEPORT",
    description:
      "A spaceport or cosmodrome is a site for launching (or receiving) spacecraft, by analogy to the seaport for ships or airport for aircraft. Based in the famous Cape Canaveral, our spaceport is ideally situated to take advantage of the Earth’s rotation for launch.",
    img: "img/spaceport.webp",
  },
  {
    name: "SPACE CAPSULE",
    description:
      "A space capsule is an often-crewed spacecraft that uses a blunt-body reentry capsule to reenter the Earth's atmosphere without wings. Our capsule is where you'll spend your time during the flight. It includes a space gym, cinema, and plenty of other activities to keep you entertained.",
    img: "img/capsule.webp",
  },
];

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) return;

    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Animation de sortie
    technoTxt.classList.add("techno-slide", "out-left");
    technoImg.classList.add("techno-slide", "out-left");

    // Prépare la nouvelle image à l’avance
    const newImg = new Image();
    newImg.src = technologies[index].img;

    newImg.onload = () => {
      // Attendre que la sortie soit terminée
      setTimeout(() => {
        // Changement du contenu pendant invisibilité
        title.textContent = technologies[index].name;
        text.textContent = technologies[index].description;

        // Transition fluide d'image : fade-out → reflow → src → fade-in
        image.style.opacity = 0;

        // ⚙️ Reflow pour forcer la transition (très important)
        void image.offsetWidth;

        setTimeout(() => {
          image.src = newImg.src;

          // ⚙️ Reflow encore une fois avant de rétablir l’opacité
          void image.offsetWidth;

          image.style.opacity = 1;

          // Fin de sortie → début d’entrée
          technoTxt.classList.remove("out-left");
          technoImg.classList.remove("out-left");
          technoTxt.classList.add("in");
          technoImg.classList.add("in");

          // Nettoyage après animation complète
          setTimeout(() => {
            technoTxt.classList.remove("in");
            technoImg.classList.remove("in");
          }, 1200);
        }, 200); // petit délai pour que l’effet de fade-out soit visible
      }, 500); // moitié de ta durée de transition
    };
  });
});

