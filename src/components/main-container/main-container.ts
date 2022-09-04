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

  private title: Component;

  private description: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['main-container']);

    this.helloWindow = new Component(this.element, 'div', ['main-container__hello-window']);

    this.title = new Component(this.helloWindow.element, 'h1', ['main-container__title'], '"EnWorld" - онлайн приложение по изучению английского языка.');

    this.description = new Component(this.helloWindow.element, 'p', ['main-container__description'], 'На странице "Электронный учебник" находится 3 600 слов, которые поделены на шесть разделов, в зависимости от уровня сложности. Наиболее сложные слова можно добавить в седьмой раздел, и сконцентрировать на них особое внимание. Также, приложение оснащено двумя интересными играми, для лучшего усвоения материала. Для отслеживания прогресса в изучении, можно воспользоваться статистикой. Вот и вся нехитрая инструкция, удачи в изучении =)');

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
