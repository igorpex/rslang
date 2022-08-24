import Component from '../../../utils/component';
import './input.scss';

class UIInput extends Component {
  getInputValue: (event: Event) => void = () => {};

  constructor(
    parentNode: HTMLElement,
    tagName: keyof HTMLElementTagNameMap = 'input',
    styles: string[] = [],
    type?: string,

    initValue?: string,
  ) {
    super(parentNode, tagName, ['ui-input']);
    if(type !== undefined) {
      this.element.setAttribute('type', type);
    }
    this.element.classList.add(...styles);

    if (initValue) {
      this.element.setAttribute('value', initValue);
    }

    this.element.addEventListener('input', (event) => this.getInputValue(event));
  }
}
export default UIInput;
