import Component from '../../utils/component';
import ebookImg from '../../assets/svg/book.svg';
import gameImg from '../../assets/svg/game.svg';
import statisticsImg from '../../assets/svg/statistics.svg';
import teamImg from '../../assets/svg/team.svg';

import './index.scss';

class MainContainer extends Component {
  private helloWindow: Component;

  private dividedLine: Component;

  private menuWindow: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['main-container']);

    this.helloWindow = new Component(this.element, 'div', ['main-container__hello-window']);

    this.dividedLine = new Component(this.element, 'div', ['main-container__divided-line']);

    this.menuWindow = new Component(this.element, 'div', ['main-container__menu-window']);

    this.createMenuLinks();
  }

  createMenuLinks() {
    const linkNames = ['ebook', 'games', 'statistics', 'team'];
    const texts = ['Электронный учебник', 'Мини-игры', 'Статистика', 'О команде'];
    const src = [ebookImg, gameImg, statisticsImg, teamImg];

    for (let i = 0; i < linkNames.length; i++) {
      const linkContainer = document.createElement('a');
      linkContainer.classList.add('main-container__menu-window__link-container');
      linkContainer.setAttribute('href', `#/${linkNames[i]}`);
      this.menuWindow.element.appendChild(linkContainer);

      const img = document.createElement('div');
      img.classList.add('link-container__img');
      img.style.backgroundImage = `url(${src[i]})`;
      linkContainer.appendChild(img);

      const text = document.createElement('p');
      text.classList.add('link-container__text');
      text.innerHTML = texts[i];
      linkContainer.appendChild(text);
    }
  }

  private clear() {
    //this.content.element.innerHTML = '';
  }
}

export default MainContainer;
