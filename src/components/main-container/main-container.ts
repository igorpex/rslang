import Component from '../../utils/component';

import './index.scss';
import Footer from '../footer/footer';

class MainContainer extends Component {
  private content: Component;

  private title: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['main-container']);

    this.title = new Component(this.element, 'h2');
    this.title.element.innerHTML = 'This is a main page title';
    this.content = new Component(this.element, 'div', ['main-content'], 'This is a content of main page div, added via "components/main-container/main-container.ts"');
  }

  private clear() {
    this.content.element.innerHTML = '';
  }
}

export default MainContainer;
