import MainContainer from '../../components/main-container/main-container';
import Component from '../../utils/component';

class Main extends Component {
  private mainContainer: MainContainer;
  // private pageContent: MainContainer;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['main']);

    this.mainContainer = new MainContainer(this.element);
    const content = document.createElement('p');
    content.innerHTML = 'This is content added via "pages/main/main.ts"';
    this.mainContainer.element.append(content);
  }
}

export default Main;
