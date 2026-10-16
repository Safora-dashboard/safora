/** Find an expected element and fail with a useful error if the page contract changed. */
export function requiredElement(/** @type {string} */ selector, /** @type {ParentNode} */ root = document) {
  const element = root.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Expected an HTML element matching "${selector}".`);
  }
  return element;
}

/** @template {keyof HTMLElementTagNameMap} T
 * @param {T} tag
 * @param {string} className
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[T]}
 */
export function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
