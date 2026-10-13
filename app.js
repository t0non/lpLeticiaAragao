'use strict';

lucide.createIcons({ attrs: { 'stroke-width': 2 } });

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const contactMessage = 'Olá, Letícia! Gostaria de informações sobre o atendimento psicológico.';
document.querySelectorAll('[data-contact]').forEach(link => {
  const url = new URL(link.href);
  url.searchParams.set('phone', '5532988042418');
  url.searchParams.set('text', contactMessage);
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.slides');
  const slides = [...track.children];
  const dots = carousel.querySelector('.dots');
  let index = 0;
  let last = 0;
  let step = 1;
  let paused = false;

  function markActive() {
    index = Math.min(last, Math.round(track.scrollLeft / step));
    [...dots.children].forEach((dot, n) => dot.setAttribute('aria-current', String(n === index)));
  }
  function goTo(next) {
    index = (next + last + 1) % (last + 1);
    track.scrollTo({ left: index * step, behavior: prefersReducedMotion.matches ? 'instant' : 'smooth' });
  }
  function measure() {
    step = slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    last = Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step));
    if (dots.children.length !== last + 1) {
      dots.replaceChildren(...Array.from({length:last + 1}, (_, n) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', 'Ir para o item ' + (n + 1));
        button.addEventListener('click', () => goTo(n));
        return button;
      }));
    }
    markActive();
  }
  carousel.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => goTo(index + Number(button.dataset.step))));
  track.addEventListener('scroll', markActive, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  carousel.addEventListener('pointerenter', () => {paused = true;});
  carousel.addEventListener('pointerleave', () => {paused = false;});
  new ResizeObserver(measure).observe(track);
  measure();
  setInterval(() => {
    const rect = carousel.getBoundingClientRect();
    if (!paused && !prefersReducedMotion.matches && !document.hidden && !carousel.contains(document.activeElement) && rect.top < innerHeight && rect.bottom > 0 && !document.querySelector('dialog[open]')) goTo(index + 1);
  }, 7000);
});

const tabButtons = [...document.querySelectorAll('[data-location]')];
function activateTab(button) {
  tabButtons.forEach(tab => {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
}
tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => activateTab(button));
  button.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = tabButtons[(index + 1) % tabButtons.length];
    if (event.key === 'ArrowLeft') target = tabButtons[(index + tabButtons.length - 1) % tabButtons.length];
    if (event.key === 'Home') target = tabButtons[0];
    if (event.key === 'End') target = tabButtons.at(-1);
    if (target) {event.preventDefault(); activateTab(target); target.focus();}
  });
});

const privacyDialog = document.querySelector('.privacy-dialog');
function openPrivacy() {
  privacyDialog.showModal();
}
document.querySelectorAll('[data-open-privacy]').forEach(button => button.addEventListener('click', openPrivacy));

document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
