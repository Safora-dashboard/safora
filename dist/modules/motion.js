/** Ambient motion: count-up figures, cursor spotlights and header scroll state.
 * Everything here is decorative, so reduced-motion visitors keep the static page.
 */
export function initializeMotion() {
  const header = document.querySelector('.site-header');
  if (header) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  initializeCounters();
  if (window.matchMedia('(hover: hover)').matches) initializeSpotlights();
}

/** Count a figure up to the value already present in the markup. */
function initializeCounters() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue;
        observer.unobserve(entry.target);
        countUp(entry.target);
      }
    },
    { threshold: 0.6 },
  );
  for (const node of document.querySelectorAll('[data-count]')) observer.observe(node);
}

/** @param {HTMLElement} node */
function countUp(node) {
  const target = Number(node.dataset.count);
  const decimals = Number(node.dataset.decimals ?? 0);
  if (!Number.isFinite(target)) return;

  const duration = 1400;
  const start = performance.now();

  /** @param {number} now */
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    node.textContent = (target * eased).toFixed(decimals);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/** Cards light up under the cursor; the position is exposed to CSS as custom properties. */
function initializeSpotlights() {
  const cards = document.querySelectorAll(
    '.module-group, .team-grid > article, .governance-grid > article, .fx-card',
  );
  for (const card of cards) {
    if (!(card instanceof HTMLElement)) continue;
    card.classList.add('has-spotlight');
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    });
  }
}
