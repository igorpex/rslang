import Component from '../../utils/component';
import './header.scss';

class Header extends Component {
  private navItems: Component[] = [];

  private readonly linkToMain: Component;

  private readonly linkToEbook: Component;

  private readonly linkToStatistics: Component;

  private readonly linkToTeam: Component;

  private readonly linkToMiniGames: Component;

  private readonly loginButton: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['header']);
    const img = document.createElement('img');
    img.classList.add('header-logo');
    img.src = './logo.png';

    this.element.append(img);

    this.linkToMain = new Component(
      this.element,
      'a',
      ['nav__item'],
      'Main',
    );

    this.linkToEbook = new Component(
      this.element,
      'a',
      ['nav__item'],
      'E-Book',
    );

    this.linkToMiniGames = new Component(
      this.element,
      'a',
      ['nav__item'],
      'MiniGames',
    );

    this.linkToStatistics = new Component(
      this.element,
      'a',
      ['nav__item'],
      'Statistics',
    );

    this.linkToTeam = new Component(
      this.element,
      'a',
      ['nav__item'],
      'Team',
    );

    this.loginButton = new Component(
      this.element,
      'a',
      ['nav__item', 'header__login'],
      'Login',
    );

    this.linkToMain.element.setAttribute('href', '#/');
    this.linkToEbook.element.setAttribute('href', '#/ebook');
    this.linkToMiniGames.element.setAttribute('href', '#/games');
    this.linkToStatistics.element.setAttribute('href', '#/statistics');
    this.linkToTeam.element.setAttribute('href', '#/team');
    this.loginButton.element.setAttribute('href', '#/login');

    this.navItems = [this.linkToMain, this.linkToEbook, this.linkToMiniGames,
      this.linkToStatistics, this.linkToTeam, this.loginButton];

    window.addEventListener('hashchange', () => this.updateActive(this.navItems));
    window.addEventListener('load', () => this.updateActive(this.navItems));
  }

  private updateActive(navItems: Component[]): void {
    this.navItems = navItems.map((item) => {
      item.element.classList.remove('nav__item--active');
      if (item.element.getAttribute('href') === window.location.hash) {
        item.element.classList.add('nav__item--active');
      }

      return item;
    });
  }
}

export default Header;
