/** Slide sections into place as they enter the viewport. Content stays fully readable without it. */
export function initializeReveal() {
  const targets = [...document.querySelectorAll('[data-reveal]')];
  if (
    targets.length === 0 ||
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  document.documentElement.classList.add('reveal-ready');
  for (const target of targets) observer.observe(target);
}
