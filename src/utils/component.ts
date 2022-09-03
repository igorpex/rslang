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

  destroy(): void {
    this.element.remove();
  }
}

export default Component;
