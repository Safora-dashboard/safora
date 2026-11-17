import { requiredElement } from './dom.js';

/** What each node of the illustrative exposure path is, and why it matters.
 * @type {Readonly<Record<string, { kicker: string, title: string, text: string }>>}
 */
const NODES = {
  internet: {
    kicker: 'STARTING POINT',
    title: 'Internet',
    text: 'Anything reachable from outside is where an investigation usually begins. External reachability is what turns a weakness into an exposure.',
  },
  workload: {
    kicker: 'ENTRY POINT',
    title: 'Exposed workload',
    text: 'A public-facing resource in the example environment. On its own it is one finding; what it connects to decides how much it matters.',
  },
  identity: {
    kicker: 'ACCESS',
    title: 'Privileged identity',
    text: 'An identity with elevated access, associated with the workload. It links the exposed resource to things far more sensitive than the workload itself.',
  },
  data: {
    kicker: 'WHAT IS AT STAKE',
    title: 'Critical data store',
    text: 'The sensitive resource at the end of this example path. Seeing the whole path explains why the first finding deserves attention.',
  },
  control: {
    kicker: 'DEFENSE',
    title: 'Validated control',
    text: 'A control whose assessment passed its evaluated checks. This route stops here, so effort can go to the path that stays open.',
  },
  service: {
    kicker: 'OUT OF REACH',
    title: 'Internal service',
    text: 'A resource behind the validated control. Not every asset that looks reachable sits on an open path.',
  },
};

/** Make the hero graph explorable: each node becomes a toggle that explains itself. */
export function initializePathGraph() {
  const graph = document.querySelector('.path-graph');
  const panel = document.querySelector('.path-insight');
  if (!(graph instanceof SVGSVGElement) || !(panel instanceof HTMLElement)) return;

  const kicker = requiredElement('[data-node-kicker]', panel);
  const title = requiredElement('[data-node-title]', panel);
  const text = requiredElement('[data-node-text]', panel);
  const summary = {
    kicker: kicker.textContent ?? '',
    title: title.textContent ?? '',
    text: text.textContent ?? '',
  };
  const nodes = [...graph.querySelectorAll('[data-node]')].filter((node) => node instanceof SVGGElement);

  /** @type {string | null} */
  let selected = null;

  /** @param {string | null} key */
  function select(key) {
    selected = key === selected ? null : key;
    const detail = (selected && NODES[selected]) || summary;
    kicker.textContent = detail.kicker;
    title.textContent = detail.title;
    text.textContent = detail.text;
    panel?.classList.toggle('is-node', selected !== null);
    for (const node of nodes) {
      const active = node.getAttribute('data-node') === selected;
      node.classList.toggle('is-selected', active);
      node.setAttribute('aria-pressed', String(active));
    }
  }

  for (const node of nodes) {
    const key = node.getAttribute('data-node');
    const detail = key ? NODES[key] : undefined;
    if (!key || !detail) continue;
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-pressed', 'false');
    node.setAttribute('aria-label', `${detail.title}: what it is and why it matters`);
    node.addEventListener('click', () => select(key));
    node.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent) || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      select(key);
    });
  }

  // With interactive children the graphic is a group of controls, not a single image.
  graph.setAttribute('role', 'group');
  graph.classList.add('is-interactive');
  const hint = document.querySelector('[data-node-hint]');
  if (hint instanceof HTMLElement) hint.hidden = false;
}
