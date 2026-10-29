'use strict';

document.querySelectorAll('[data-contact-channel]').forEach(button => {
  button.addEventListener('click', () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', { contact_channel: button.dataset.contactChannel });
    }
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  mobileNav.hidden = true;
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
  mobileNav.hidden = isOpen;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header') && !mobileNav.hidden) closeMenu();
});
window.matchMedia('(min-width: 681px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

if ('IntersectionObserver' in window) {
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-10% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('#inicio, #beneficios, #como-funciona, #preguntas').forEach(section => navObserver.observe(section));

  const mobileCta = document.querySelector('.mobile-cta');
  let contactVisible = false;
  let heroActionPassed = false;
  const updateContactShortcut = () => {
    const hidden = contactVisible || !heroActionPassed;
    mobileCta.classList.toggle('is-hidden', hidden);
    mobileCta.tabIndex = hidden ? -1 : 0;
  };
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { contactVisible = entry.isIntersecting; });
    updateContactShortcut();
  }, { threshold: 0.15 });
  contactObserver.observe(document.querySelector('#contacto'));
  const heroActionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      heroActionPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
    });
    updateContactShortcut();
  }, { threshold: 0 });
  heroActionObserver.observe(document.querySelector('.hero-cta'));
}
