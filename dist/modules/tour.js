import { requiredElement } from './dom.js';

/** @typedef {{ view: string, target: string, title: string, body: string, action?: boolean }} TourStep */

/** One example investigation, told through the existing preview views.
 * @type {readonly TourStep[]}
 */
const STEPS = [
  {
    view: 'overview',
    target: '#preview-metrics',
    title: 'Start with the overview',
    body: 'Four figures summarise the example environment: active attacks, exposure paths, control pass rate and identity risks.',
  },
  {
    view: 'overview',
    target: '.findings-card',
    title: 'See what needs attention first',
    body: 'Priority findings from different domains share one list. The critical one connects an exposed workload with a privileged identity.',
  },
  {
    view: 'overview',
    target: '#preview-findings .finding-row',
    title: 'Open a finding',
    body: 'Each finding carries its evidence, the affected resource and investigation guidance. Open it, then close it to continue.',
    action: true,
  },
  {
    view: 'cloud',
    target: '#preview-findings',
    title: 'Switch to the cloud view',
    body: 'The same layout, now with cloud context: example findings from Azure, AWS and Microsoft 365 side by side.',
  },
  {
    view: 'controls',
    target: '.posture-card',
    title: 'Validate the controls',
    body: 'The pass rate shows where defenses stand, and the failed checks behind it are one click away in the findings list.',
  },
];

const TARGET_CLASS = 'is-tour-target';

/** A guided walkthrough of the product preview. Non-modal: the explorer stays fully usable.
 * @param {import('./tabs.js').Tabs} tabs
 */
export function initializeTour(tabs) {
  const root = document.querySelector('[data-tour]');
  if (!(root instanceof HTMLElement)) return;

  const intro = requiredElement('[data-tour-intro]', root);
  const introText = requiredElement('[data-tour-intro-text]', root);
  const demoLink = requiredElement('[data-tour-demo]', root);
  const panel = requiredElement('[data-tour-step]', root);
  const count = requiredElement('[data-tour-count]', root);
  const title = requiredElement('[data-tour-title]', root);
  const body = requiredElement('[data-tour-body]', root);
  const start = requiredElement('[data-tour-start]', root);
  const back = requiredElement('[data-tour-back]', root);
  const next = requiredElement('[data-tour-next]', root);
  const end = requiredElement('[data-tour-end]', root);
  const action = requiredElement('[data-tour-action]', root);
  const dots = [...requiredElement('[data-tour-progress]', root).children];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let index = 0;

  function clearTarget() {
    for (const node of document.querySelectorAll(`.${TARGET_CLASS}`)) node.classList.remove(TARGET_CLASS);
  }

  /** @param {number} stepIndex */
  function show(stepIndex) {
    const step = STEPS[stepIndex];
    if (!step) return;
    index = stepIndex;

    const selected = tabs.buttons.find((button) => button.getAttribute('aria-selected') === 'true');
    if (selected?.dataset.tab !== step.view) tabs.select(step.view);

    count.textContent = `Step ${stepIndex + 1} of ${STEPS.length}`;
    title.textContent = step.title;
    body.textContent = step.body;
    back.toggleAttribute('disabled', stepIndex === 0);
    next.textContent = stepIndex === STEPS.length - 1 ? 'Finish' : 'Next';
    action.hidden = !step.action;
    for (const [dotIndex, dot] of dots.entries()) dot.classList.toggle('is-done', dotIndex <= stepIndex);

    clearTarget();
    const target = document.querySelector(step.target);
    if (target instanceof HTMLElement) {
      target.classList.add(TARGET_CLASS);
      target.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
  }

  /** @param {boolean} finished */
  function stop(finished) {
    clearTarget();
    root?.classList.remove('is-active');
    panel.hidden = true;
    intro.hidden = false;
    if (finished) {
      introText.textContent = 'That was the tour. The next step is seeing it with your own environment.';
      demoLink.hidden = false;
      start.textContent = 'Restart the tour';
    }
    start.focus({ preventScroll: true });
  }

  start.addEventListener('click', () => {
    intro.hidden = true;
    panel.hidden = false;
    root.classList.add('is-active');
    show(0);
    next.focus({ preventScroll: true });
  });
  back.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => (index === STEPS.length - 1 ? stop(true) : show(index + 1)));
  end.addEventListener('click', () => stop(false));
  action.addEventListener('click', () => {
    const row = document.querySelector('#preview-findings .finding-row');
    if (row instanceof HTMLElement) row.click();
  });

  root.hidden = false;
}
