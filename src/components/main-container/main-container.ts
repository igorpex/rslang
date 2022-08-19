import Component from '../../utils/component';

import './index.scss';

class MainContainer extends Component {
  private content: Component;

  private title: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['main-container']);

    this.title = new Component(this.element, 'h2');
    this.title.element.innerHTML = 'This is a main page title';
    this.content = new Component(this.element, 'div', ['main-content'], 'This is a content of main page div, added via "components/main-container/main-container.ts"');

    const img = document.createElement('img');
    img.classList.add('main-picture');
    img.src = './main-picture.jpg';
    this.element.append(img);
  }

  private clear() {
    this.content.element.innerHTML = '';
  }
}

export default MainContainer;
