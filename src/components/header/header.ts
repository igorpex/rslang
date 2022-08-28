import Component from '../../utils/component';
import './header.scss';
import Auth from '../auth/auth/auth';
import logoImg from '../../assets/img/logo.png';

class Header extends Component {
  private navItems: Component[] = [];

  private readonly linkToMain: Component;

  private readonly linkToEbook: Component;

  private readonly linkToStatistics: Component;

  private readonly linkToTeam: Component;

  private readonly linkToMiniGames: Component;

  private readonly loginButton: Component;

  private readonly logoutButton: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['header']);

    const img = document.createElement('img');
    img.classList.add('header-logo');
    img.src = logoImg;

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

    this.linkToMain.element.setAttribute('href', '#/');
    this.linkToEbook.element.setAttribute('href', '#/ebook');
    this.linkToMiniGames.element.setAttribute('href', '#/games');
    this.linkToStatistics.element.setAttribute('href', '#/statistics');
    this.linkToTeam.element.setAttribute('href', '#/team');

    this.loginButton = new Component(
      this.element,
      'a',
      ['nav__item', 'header__login'],
      'Login',
    );

    this.logoutButton = new Component(
      this.element,
      'a',
      ['nav__item', 'header__logout'],
      'LogOut',
    );

    this.loginButton.element.setAttribute('href', '#/login');
    this.loginButton.element.setAttribute('display', 'inline');
    this.loginButton.element.style.display = 'inline-block';

    this.logoutButton.element.setAttribute('href', '#/logout');
    this.logoutButton.element.style.display = 'none';
    this.logoutButton.element.addEventListener('click', (e) => {
      e.preventDefault();
      const auth = new Auth();
      auth.logOut();
      window.location.reload();
    });

    this.navItems = [this.linkToMain, this.linkToEbook, this.linkToMiniGames,
      this.linkToStatistics, this.linkToTeam, this.loginButton, this.logoutButton];

    window.addEventListener('hashchange', () => this.updateActive(this.navItems));
    window.addEventListener('load', () => this.updateActive(this.navItems));

    this.updateLogin();
  }

  public async updateLogin() {
    const auth = new Auth();
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) {
      this.loginButton.element.style.display = 'none';
      this.logoutButton.element.style.display = 'inline-block';
    } else {
      this.loginButton.element.style.display = 'inline-block';
      this.logoutButton.element.style.display = 'none';
    }
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
