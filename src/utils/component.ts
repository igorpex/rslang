class Component {
  element: HTMLElement;

  constructor(
    parentNode: HTMLElement | null,
    tagName: keyof HTMLElementTagNameMap = 'div',
    styles: string[] = [],
    content = '',
  ) {
    this.element = document.createElement(tagName);
    this.element.classList.add(...styles);
    this.element.textContent = content;

    if (parentNode) {
      parentNode.append(this.element);
    }
  }

  static add(
    parentNode: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/default-param-last
    tagName: keyof HTMLElementTagNameMap = 'div',
    // eslint-disable-next-line @typescript-eslint/default-param-last
    styles: string[] = [],
    content = '',
  ) {
    const element = document.createElement(tagName);
    element.classList.add(...styles);
    element.textContent = content;
    if (parentNode) {
      parentNode.append(element);
    }
  }

  destroy(): void {
    this.element.remove();
  }
}

export default Component;
