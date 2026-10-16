import { element, requiredElement } from './dom.js';
import { previews } from './preview-data.js';
import { Tabs } from './tabs.js';
import { initializeFindingDialog } from './finding-dialog.js';
import { createIcon } from './icons.js';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const CHART_PATHS = [
  'M0 22 15 18 30 20 45 8 60 13 75 6 90 10 105 3 120 7',
  'M0 20 15 12 30 17 45 4 60 9 75 6 90 13 105 8 120 3',
  'M0 20 15 22 30 15 45 17 60 9 75 12 90 6 105 9 120 3',
  'M0 22 15 21 30 18 45 21 60 12 75 15 90 7 105 10 120 4',
];

/** @param {import('./preview-data.js').Metric} metric @param {number} index */
function renderMetric(metric, index) {
  const card = element('article', 'metric');
  const heading = element('div', 'metric-heading');
  const icon = createIcon(metric.icon);
  heading.append(icon, element('h4', '', metric.label));

  const chart = document.createElementNS(SVG_NAMESPACE, 'svg');
  chart.classList.add('metric-chart');
  chart.setAttribute('viewBox', '0 0 120 28');
  chart.setAttribute('preserveAspectRatio', 'none');
  chart.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NAMESPACE, 'path');
  path.setAttribute('d', CHART_PATHS[index] ?? CHART_PATHS[0]);
  chart.append(path);

  card.style.setProperty('--chart-color', metric.color);
  card.append(heading, element('strong', '', metric.value), element('p', '', metric.note), chart);
  return card;
}

/** Set up presentation-only product views. No external data or user information is transmitted. */
export function initializeProductPreview() {
  const root = requiredElement('.product-explorer');
  const dialog = initializeFindingDialog();
  const tabs = new Tabs(root, (key) => {
    const preview = previews[key];
    if (!preview) return;

    for (const title of root.querySelectorAll('[data-preview-title]')) title.textContent = preview.title;
    requiredElement('#preview-metrics', root).replaceChildren(...preview.metrics.map(renderMetric));

    const findings = preview.findings.map((finding) => {
      const row = element('button', 'finding-row');
      row.type = 'button';
      row.setAttribute('aria-haspopup', 'dialog');
      const name = element('span', 'finding-name');
      name.append(element('i', finding.severity.toLowerCase()), document.createTextNode(finding.title));
      row.append(
        name,
        element('span', `severity ${finding.severity.toLowerCase()}`, finding.severity),
        element('span', 'finding-area', finding.area),
        createIcon('chevron-right'),
      );
      row.lastElementChild?.classList.add('finding-arrow');
      row.addEventListener('click', () => dialog.open(finding, row));
      return row;
    });
    requiredElement('#preview-findings', root).replaceChildren(...findings);
    requiredElement('#posture-title', root).textContent = preview.postureLabel;
    requiredElement('#posture-value', root).replaceChildren(
      document.createTextNode(String(preview.score)),
      element('span', '', '%'),
    );

    const ring = root.querySelector('.ring-value');
    if (ring instanceof SVGElement) ring.style.strokeDashoffset = String(358.14 * (1 - preview.score / 100));
  });

  for (const link of document.querySelectorAll('[data-preview-link]')) {
    if (link instanceof HTMLElement)
      link.addEventListener('click', () => tabs.select(link.dataset.previewLink));
  }

  for (const button of document.querySelectorAll('[data-open-example]')) {
    if (button instanceof HTMLElement) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        dialog.open(previews.overview.findings[0], button);
      });
    }
  }
}
