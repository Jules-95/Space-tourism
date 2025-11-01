// js/techno.js

// Sélection des éléments
const buttons = document.querySelectorAll(".techno-btn");
const title = document.querySelector(".techno-txt h3");
const text = document.querySelector(".techno-txt p");
const image = document.querySelector(".techno-img img");

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
    // 1. Retirer la classe active de tous les boutons
    buttons.forEach(btn => btn.classList.remove("active"));
    // 2. Ajouter la classe active sur le bouton cliqué
    button.classList.add("active");

    // 3. Mettre à jour le contenu
    title.textContent = technologies[index].name;
    text.textContent = technologies[index].description;
    image.src = technologies[index].img;
  });
});
