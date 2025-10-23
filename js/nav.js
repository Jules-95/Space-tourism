const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

// Vérification que les éléments existent
if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';

    // met à jour l'état d'accessibilité
    burger.setAttribute('aria-expanded', String(!isOpen));

    // active/désactive les classes
    burger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.classList.toggle('no-scroll', !isOpen); // bloque le scroll quand le menu est ouvert
  });
}
