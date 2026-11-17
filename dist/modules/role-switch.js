import { requiredElement } from './dom.js';

/** @typedef {{ view: string, heading: [string, string], text: string, caption: string }} RoleView */

/** How the platform section reads for each audience.
 * @type {Readonly<Record<string, RoleView>>}
 */
const ROLES = {
  analyst: {
    view: 'overview',
    heading: ['Your investigation.', 'In focus. In context.'],
    text: 'Start from the priority findings, open one, and follow its evidence and investigation guidance.',
    caption:
      'For security operations: finding triage, threat and exposure perspectives, and shared finding history.',
  },
  cloud: {
    view: 'cloud',
    heading: ['Your cloud estate.', 'In focus. In context.'],
    text: 'Compare example findings from Azure, AWS and Microsoft 365 with their scope and affected assets.',
    caption:
      'For cloud and identity teams: Azure, AWS and Microsoft 365 views with identity and access context.',
  },
  leader: {
    view: 'controls',
    heading: ['Your security posture.', 'In focus. In context.'],
    text: 'See where the controls stand, then drill into the failed checks behind the pass rate.',
    caption:
      'For security leadership: the Organizational Risk Index, control and coverage posture, and financial risk perspectives.',
  },
};

/** Let visitors read the platform section, and open the matching preview view, as their own role.
 * @param {import('./tabs.js').Tabs} tabs
 */
export function initializeRoleSwitch(tabs) {
  const root = document.querySelector('[data-role-switch]');
  if (!(root instanceof HTMLElement)) return;

  const heading = requiredElement('[data-role-heading]');
  const text = requiredElement('[data-role-text]');
  const caption = requiredElement('[data-role-caption]');
  const buttons = [...root.querySelectorAll('button')];

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const role = ROLES[button.dataset.role ?? ''];
      if (!role) return;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      heading.replaceChildren(role.heading[0], document.createElement('br'), role.heading[1]);
      text.textContent = role.text;
      caption.textContent = role.caption;
      tabs.select(role.view);
    });
  }

  root.hidden = false;
}
