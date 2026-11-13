const CONTACT = 'support@safora.ai';

/** Turn the demo-request form into a prepared email. The site has no backend, so nothing is
 * transmitted or stored here: the visitor reviews and sends the message from their own mail app.
 */
export function initializeDemoForm() {
  const form = document.querySelector('#demo-form');
  const status = document.querySelector('#demo-status');
  if (!(form instanceof HTMLFormElement) || !(status instanceof HTMLElement)) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = (/** @type {string} */ name) => String(data.get(name) ?? '').trim();

    const lines = [
      `Name: ${value('name')}`,
      `Work email: ${value('email')}`,
      `Company: ${value('company')}`,
      `Interested in: ${value('interest')}`,
    ];
    if (value('message')) lines.push('', value('message'));

    const subject = `SAFORA demo request: ${value('company')}`;
    const href = `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;

    const retry = document.createElement('a');
    retry.href = href;
    retry.textContent = 'Open the email again';
    status.replaceChildren(
      document.createTextNode('Your email app should now show the request, ready to send. '),
      retry,
      document.createTextNode(` or write to ${CONTACT}.`),
    );
    status.hidden = false;
    window.location.href = href;
  });
}
