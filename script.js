'use strict';

const prefilterForm = document.querySelector('#prefilter-form');
const negocio = document.querySelector('#negocio');
const otroNegocio = document.querySelector('#otro-negocio');
const detalleNegocio = document.querySelector('#detalle-negocio');

negocio.addEventListener('change', () => {
  const isOther = negocio.value === 'Otro';
  otroNegocio.hidden = !isOther;
  detalleNegocio.required = isOther;
  detalleNegocio.setCustomValidity('');
  if (!isOther) detalleNegocio.value = '';
});

prefilterForm.addEventListener('submit', event => {
  event.preventDefault();
  const answers = new FormData(prefilterForm);
  const business = answers.get('negocio') === 'Otro' ? answers.get('detalle-negocio').trim() : answers.get('negocio');
  if (!business) {
    detalleNegocio.setCustomValidity('Contanos a qué se dedica tu negocio.');
    detalleNegocio.reportValidity();
    return;
  }
  detalleNegocio.setCustomValidity('');
  const message = 'Hola, quiero consultar por una operación.\n\nVolumen diario estimado: ' + answers.get('volumen') + '\nNegocio: ' + business + '\nPrimera vez cambiando pesos a USDT: ' + answers.get('primera-vez');
  const url = 'https://t.me/Cobaltcambios?text=' + encodeURIComponent(message);
  if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { contact_channel: 'telegram' });
  window.open(url, '_blank', 'noopener,noreferrer');
});

detalleNegocio.addEventListener('input', () => detalleNegocio.setCustomValidity(''));

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
  let filterVisible = false;
  let heroActionPassed = false;
  const updateContactShortcut = () => {
    const hidden = contactVisible || filterVisible || !heroActionPassed;
    mobileCta.classList.toggle('is-hidden', hidden);
    mobileCta.tabIndex = hidden ? -1 : 0;
  };
  const contactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { contactVisible = entry.isIntersecting; });
    updateContactShortcut();
  }, { threshold: 0.15 });
  contactObserver.observe(document.querySelector('#contacto'));
  const filterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { filterVisible = entry.isIntersecting; });
    updateContactShortcut();
  }, { threshold: 0.15 });
  filterObserver.observe(document.querySelector('#prefiltro'));
  const heroActionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      heroActionPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
    });
    updateContactShortcut();
  }, { threshold: 0 });
  heroActionObserver.observe(document.querySelector('.hero-cta'));
}
