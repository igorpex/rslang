import Component from '../../utils/component';
import './header.scss';
import Auth from '../auth/auth/auth';
import logoImg from '../../assets/svg/logo.svg';
import ebookImg from '../../assets/svg/book.svg';
import gameImg from '../../assets/svg/game.svg';
import statisticsImg from '../../assets/svg/statistics.svg';
import teamImg from '../../assets/svg/team.svg';

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

  private readonly darkBg: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['header', 'container']);

    // logo in the left corner of header
    this.logo = new Component(
      this.element,
      'a',
      ['header__logo'],
    );

    // container for login/logout buttons AND burger in the right corner of header
    this.loginBurgerContainer = new Component(
      this.element,
      'div',
      ['header__login-burger-container'],
    );

    this.loginButton = new Component(
      this.loginBurgerContainer.element,
      'a',
      ['header__login'],
    );

    this.logoutButton = new Component(
      this.loginBurgerContainer.element,
      'a',
      ['header__logout'],
    );

    this.burger = new Component(
      this.loginBurgerContainer.element,
      'div',
      ['header__burger'],
    );

    // middle line of burger, added without "before" and "after" features
    this.burgerSpan = new Component(
      this.burger.element,
      'span',
      ['header__burger-span'],
    );

    // side burger panel
    this.burgerPanel = new Component(
      this.element,
      'div',
      ['header__burger-panel'],
    );

    // container for menu with links
    this.nav = new Component(
      this.burgerPanel.element,
      'nav',
      ['header__burger-panel__nav'],
    );

    // link to main page
    this.linkToMain = new Component(
      this.nav.element,
      'a',
      ['nav__item'],
    );

    const linkToMainImg = document.createElement('div');
    linkToMainImg.classList.add('nav__item-img');
    linkToMainImg.style.backgroundImage = `url(${logoImg})`;
    this.linkToMain.element.appendChild(linkToMainImg);

    const linkToMainText = document.createElement('p');
    linkToMainText.classList.add('nav__item-text');
    linkToMainText.innerHTML = 'Главная';
    this.linkToMain.element.appendChild(linkToMainText);

    // link to ebook page
    this.linkToEbook = new Component(
      this.nav.element,
      'a',
      ['nav__item', 'ebook'],
    );

    const linkToEbookImg = document.createElement('div');
    linkToEbookImg.classList.add('nav__item-img', 'ebook');
    linkToEbookImg.style.backgroundImage = `url(${ebookImg})`;
    this.linkToEbook.element.appendChild(linkToEbookImg);

    const linkToEbookText = document.createElement('p');
    linkToEbookText.classList.add('nav__item-text', 'ebook');
    linkToEbookText.innerHTML = 'Электронный учебник';
    linkToEbookText.style.width = '146px';
    this.linkToEbook.element.appendChild(linkToEbookText);

    // link to game page
    this.linkToMiniGames = new Component(
      this.nav.element,
      'a',
      ['nav__item', 'games'],
    );

    const linkToMiniGamesImg = document.createElement('div');
    linkToMiniGamesImg.classList.add('nav__item-img', 'games');
    linkToMiniGamesImg.style.backgroundImage = `url(${gameImg})`;
    this.linkToMiniGames.element.appendChild(linkToMiniGamesImg);

    const linkToMiniGamesText = document.createElement('p');
    linkToMiniGamesText.classList.add('nav__item-text', 'games');
    linkToMiniGamesText.innerHTML = 'Мини-игры';
    this.linkToMiniGames.element.appendChild(linkToMiniGamesText);

    // link to statistics page
    this.linkToStatistics = new Component(
      this.nav.element,
      'a',
      ['nav__item', 'statistics'],
    );

    const linkToStatisticsImg = document.createElement('div');
    linkToStatisticsImg.classList.add('nav__item-img', 'statistics');
    linkToStatisticsImg.style.backgroundImage = `url(${statisticsImg})`;
    this.linkToStatistics.element.appendChild(linkToStatisticsImg);

    const linkToStatisticsText = document.createElement('p');
    linkToStatisticsText.classList.add('nav__item-text', 'statistics');
    linkToStatisticsText.innerHTML = 'Статистика';
    this.linkToStatistics.element.appendChild(linkToStatisticsText);

    // link to team page
    this.linkToTeam = new Component(
      this.nav.element,
      'a',
      ['nav__item', 'team'],
    );

    const linkToTeamImg = document.createElement('div');
    linkToTeamImg.classList.add('nav__item-img', 'team');
    linkToTeamImg.style.backgroundImage = `url(${teamImg})`;
    this.linkToTeam.element.appendChild(linkToTeamImg);

    const linkToTeamText = document.createElement('p');
    linkToTeamText.classList.add('nav__item-text', 'team');
    linkToTeamText.innerHTML = 'О команде';
    this.linkToTeam.element.appendChild(linkToTeamText);

    // dark background for opened burger
    this.darkBg = new Component(
      this.element,
      'div',
      ['dark'],
    );

    // open or close burger panel by clicking on burger/cross
    this.burger.element.addEventListener('click', () => {
      this.openBurger();
    });

    // close burger panel by clicking on link
    this.nav.element.addEventListener('click', (e) => {
      const targetClassName = (e.target as HTMLElement).className;
      if (targetClassName.includes('nav__item')) {
        this.openBurger();
      }
    });

    // close burger panel by clicking on dark background
    this.darkBg.element.addEventListener('click', () => {
      this.openBurger();
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

  // 1.open/close burger panel 2.change cross animation 3.add/remove span line from the middle of burger 4. open/close dark background
  public openBurger() {
    this.burgerPanel.element.classList.toggle('active');
    this.burger.element.classList.toggle('active');
    this.burgerSpan.element.classList.toggle('active');
    this.darkBg.element.classList.toggle('active');
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
