/** One source for both presentation icons and product metric icons. */
export const ICON_NAMES = /** @type {const} */ ([
  'active-attack',
  'exposure-graph',
  'control-validation',
  'identity-access',
  'cloud-security',
  'agent-health',
  'infrastructure-network',
  'security-posture',
  'threat-hunting',
  'crq-financial',
  'devsecops',
  'ai-exposure',
  'attack-pressure',
  'campaign-simulation',
  'external-service',
  'exposure-intelligence',
  'zero-day',
  'overview',
  'workspace-lock',
  'permissions',
  'audit',
  'arrow-up-right',
  'arrow-down',
  'arrow-up',
  'arrow-right',
  'arrow-left',
  'chevron-right',
  'corner-down-right',
  'plus',
  'close',
]);

/** @typedef {typeof ICON_NAMES[number]} IconName */

/** Decorative SVG icons inherit their color and size from the surrounding UI.
 * @param {IconName} name
 * @returns {SVGSVGElement}
 */
export function createIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `/assets/icons.svg#${name}`);
  svg.append(use);
  return svg;
}
