import { element, requiredElement } from './dom.js';

/** Native modal dialog provides focus containment, Escape handling and background inertness. */
export function initializeFindingDialog() {
  const candidate = document.querySelector('#finding-dialog');
  if (!(candidate instanceof HTMLDialogElement)) throw new Error('Finding dialog is missing.');
  const dialog = candidate;

  /** @type {HTMLElement | null} */
  let trigger = null;

  for (const button of dialog.querySelectorAll('[data-close-dialog]')) {
    button.addEventListener('click', () => dialog.close());
  }
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('has-dialog');
    trigger?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [
      ...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]'),
    ].filter((node) => node instanceof HTMLElement && node.tabIndex >= 0 && node.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first && last instanceof HTMLElement) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last && first instanceof HTMLElement) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    ) {
      dialog.close();
    }
  });

  /** @param {import('./preview-data.js').Finding} finding @param {HTMLElement} source */
  function open(finding, source) {
    trigger = source;
    requiredElement('#finding-dialog-title', dialog).textContent = finding.title;
    requiredElement('#dialog-description', dialog).textContent = finding.description;
    requiredElement('#dialog-area', dialog).textContent = finding.area;
    requiredElement('#dialog-resource', dialog).textContent = finding.resource;
    requiredElement('#dialog-guidance', dialog).textContent = finding.guidance;

    const severity = requiredElement('#dialog-severity', dialog);
    severity.textContent = finding.severity;
    severity.className = `severity ${finding.severity.toLowerCase()}`;
    requiredElement('#dialog-evidence', dialog).replaceChildren(
      ...finding.evidence.map((text) => element('li', '', text)),
    );

    document.documentElement.classList.add('has-dialog');
    dialog.showModal();
  }

  return { open };
}
