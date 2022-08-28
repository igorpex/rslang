class Component {
  appendChild(img: HTMLDivElement) {
    throw new Error('Method not implemented.');
  }
  element: HTMLElement;

  constructor(
    parentNode: HTMLElement,
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
