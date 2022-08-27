import Component from '../../utils/component';
import mainImage from '../../assets/images/main-picture.jpg';

import './index.scss';
import Footer from '../footer/footer';

class MainContainer extends Component {
  private content: Component;

  private title: Component;

  private footer: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['main-container']);

    this.title = new Component(this.element, 'h2');
    this.title.element.innerHTML = 'This is a main page title';
    this.content = new Component(this.element, 'div', ['main-content'], 'This is a content of main page div, added via "components/main-container/main-container.ts"');

    const img = document.createElement('img');
    img.classList.add('main-picture');
    img.src = mainImage;
    this.element.append(img);

    this.footer = new Footer(this.element);
  }

  private clear() {
    this.content.element.innerHTML = '';
  }
}

export default MainContainer;
