/** Accessible, manually sized tab groups with automatic keyboard activation. */
export class Tabs {
  /** @param {HTMLElement} root
   * @param {(key: string, button: HTMLButtonElement) => void} onChange
   */
  constructor(root, onChange) {
    this.root = root;
    this.onChange = onChange;
    this.buttons = [...root.querySelectorAll('button')].filter(
      (button) => button.getAttribute('role') === 'tab',
    );

    for (const [index, button] of this.buttons.entries()) {
      button.addEventListener('click', () => this.select(button.dataset.tab));
      button.addEventListener('keydown', (event) => {
        const vertical = root.dataset.orientation === 'vertical';
        const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
        const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
        let nextIndex;

        if (event.key === nextKey) nextIndex = (index + 1) % this.buttons.length;
        if (event.key === previousKey) nextIndex = (index - 1 + this.buttons.length) % this.buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = this.buttons.length - 1;

        if (nextIndex !== undefined) {
          event.preventDefault();
          this.select(this.buttons[nextIndex]?.dataset.tab, true);
        }
      });
    }

    this.select(this.buttons.find((button) => button.getAttribute('aria-selected') === 'true')?.dataset.tab);
  }

  /** @param {string | undefined} key @param {boolean} [focus] */
  select(key, focus = false) {
    const selected = this.buttons.find((button) => button.dataset.tab === key);
    if (!selected || !key) return;

    for (const button of this.buttons) {
      const active = button === selected;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    }

    const panelId = selected.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    panel?.setAttribute('aria-labelledby', selected.id);
    this.onChange(key, selected);
    if (focus) selected.focus();
  }
}
