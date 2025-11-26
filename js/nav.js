const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

// Vérification que le menu burger est ouvert
if (burger && nav) {
  // Capture du click sur le menu burger
  burger.addEventListener('click', () => {
    // "Est-ce que le menu burger est ouvert ?""
    const isOpen = burger.getAttribute('aria-expanded') === 'true';

    // met à jour l'état d'accessibilité
    burger.setAttribute('aria-expanded', String(!isOpen));

    // active/désactive les classes
    burger.classList.toggle('active');
    // Panneau de navigation ouvert
    nav.classList.toggle('open');
    document.body.classList.toggle('no-scroll', !isOpen); // bloque le scroll quand le menu est ouvert
  });
}
