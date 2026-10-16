import { requiredElement } from './dom.js';

/** A disclosure navigation: no modal semantics, so links remain normal page links. */
export function initializeNavigation() {
  const toggle = requiredElement('.menu-toggle');
  const navigation = requiredElement('#main-nav');
  const desktop = window.matchMedia('(min-width: 641px)');

  /** @param {boolean} open */
  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (
      event.target instanceof Node &&
      !navigation.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  desktop.addEventListener('change', ({ matches }) => {
    if (matches) setOpen(false);
  });
}
