import Component from '../../utils/component';
import './header.scss';
import Auth from '../auth/auth/auth';

class Header extends Component {
  private navItems: Component[] = [];

  private readonly logo: Component;

  private readonly loginBurgerContainer: Component;

  private readonly loginButton: Component;

  private readonly logoutButton: Component;

  private readonly burger: Component;

  private readonly burgerSpan: Component;

  private readonly burgerPanel: Component;

  private readonly nav: Component;

  private readonly linkToMain: Component;

  private readonly linkToEbook: Component;

  private readonly linkToStatistics: Component;

  private readonly linkToTeam: Component;

  private readonly linkToMiniGames: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['header', 'container']);

    //logo in the left corner of header
    this.logo = new Component(
      this.element,
      'a',
      ['header__logo'],
    )

    //container for login/logout buttons AND burger in the right corner of header
    this.loginBurgerContainer = new Component(
      this.element,
      'div',
      ['header__login-burger-container']
    );

    this.loginButton = new Component(
      document.querySelector('.header__login-burger-container') as HTMLElement,
      'a',
      ['header__login'],
    );

    this.logoutButton = new Component(
      document.querySelector('.header__login-burger-container') as HTMLElement,
      'a',
      ['header__logout'],
    );

    this.burger = new Component(
      document.querySelector('.header__login-burger-container') as HTMLElement,
      'div',
      ['header__burger'],
    );

    //middle line of burger, added without "before" and "after" features
    this.burgerSpan = new Component(
      document.querySelector('.header__burger') as HTMLElement,
      'span',
      ['header__burger-span'],
    );

    //side burger panel
    this.burgerPanel = new Component(
      this.element,
      'div',
      ['header__burger-panel'],
    )

    //links in the burger panel
    this.nav = new Component(
      document.querySelector('.header__burger-panel') as HTMLElement,
      'nav',
      ['header__burger-panel__nav'],
    )

    this.linkToMain = new Component(
      document.querySelector('.header__burger-panel__nav') as HTMLElement,
      'a',
      ['nav__item'],
      'Главная',
    );

    this.linkToEbook = new Component(
      document.querySelector('.header__burger-panel__nav') as HTMLElement,
      'a',
      ['nav__item'],
      'Электронный учебник',
    );

    this.linkToMiniGames = new Component(
      document.querySelector('.header__burger-panel__nav') as HTMLElement,
      'a',
      ['nav__item'],
      'Мини-игры',
    );

    this.linkToStatistics = new Component(
      document.querySelector('.header__burger-panel__nav') as HTMLElement,
      'a',
      ['nav__item'],
      'Статистика',
    );

    this.linkToTeam = new Component(
      document.querySelector('.header__burger-panel__nav') as HTMLElement,
      'a',
      ['nav__item'],
      'О команде',
    );

    this.burger.element.addEventListener('click', () => {
      this.openBurger();
    });

    this.nav.element.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).className === 'nav__item') {
        this.openBurger();
      }
    });

    this.logo.element.setAttribute('href', '#/');
    this.linkToMain.element.setAttribute('href', '#/');
    this.linkToEbook.element.setAttribute('href', '#/ebook');
    this.linkToMiniGames.element.setAttribute('href', '#/games');
    this.linkToStatistics.element.setAttribute('href', '#/statistics');
    this.linkToTeam.element.setAttribute('href', '#/team');

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

  public openBurger() {
    this.burgerPanel.element.classList.toggle('active');
    this.burger.element.classList.toggle('active');
    this.burgerSpan.element.classList.toggle('active');
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
