import { IRoute } from '../interfaces';
import Component from '../utils/component';
import Main from '../pages/main/main';
import Team from '../pages/team/team';
import Book from '../pages/book/book';
import Login from '../pages/login/login';
import AuthTestContainer from '../components/auth/auth-test-container/auth-test-container';
import SignupContainer from '../components/auth/signup-container/signup-container';
import Sprint from '../pages/sprint/sprint';
import Games from '../pages/games/games';
import Statistics from '../pages/statisctics/statistics';
import AudioGame from '../pages/audio-game/audioGame';

class Router {
  private readonly routes: Array<IRoute>;

  private defaultRoute: IRoute;

  // Pages
  mainPage: Component;

  teamPage: Component;

  bookPage: Component | undefined;

  loginPage: Component | undefined;

  signupPage: Component | undefined;

  gamesPage: Component;

  sprintPage: Component | undefined;

  audioGamePage: Component | undefined;

  testPage: Component | undefined;

  statisticsPage: Component | undefined;

  constructor(private rootElement: HTMLElement) {
    this.mainPage = new Main(this.rootElement);
    this.teamPage = new Team(this.rootElement);
    this.gamesPage = new Games(this.rootElement);

    this.routes = [
      {
        name: '/',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.main') as HTMLElement).classList.add('active');

          this.rootElement.append(this.mainPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
      {
        name: '/team',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.team') as HTMLElement).classList.add('active');

          this.rootElement.append(this.teamPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
      {
        name: '/ebook',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.ebook') as HTMLElement).classList.add('active');

          this.bookPage = new Book(this.rootElement);
          this.rootElement.append(this.bookPage.element);
        },
      },
      {
        name: '/ebook',
        component: () => {
          this.bookPage = new Book(this.rootElement);
          this.rootElement.append(this.bookPage.element);
        },
      },
      {
        name: '/login',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });

          this.loginPage = new Login(this.rootElement);
          this.rootElement.append(this.loginPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
      {
        name: '/signup',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });

          this.signupPage = new SignupContainer(this.rootElement);
          this.rootElement.append(this.signupPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
      {
        name: '/games',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.game') as HTMLElement).classList.add('active');

          this.rootElement.append(this.gamesPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
      {
        name: '/games/sprint',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.game') as HTMLElement).classList.add('active');

          this.sprintPage = new Sprint(this.rootElement);
          this.rootElement.append(this.sprintPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'none';
        },
      },
      {
        name: '/statistics',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.statistics') as HTMLElement).classList.add('active');
          
          this.statisticsPage = new Statistics(this.rootElement);
          this.rootElement.append(this.statisticsPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
      {
        name: '/games/audio-challenge',
        component: () => {
          document.querySelectorAll('.nav__item.active').forEach((item) => {
            item.classList.remove('active');
          });
          (document.querySelector('.nav__item.game') as HTMLElement).classList.add('active');
          
          this.audioGamePage = new AudioGame(this.rootElement);
          this.rootElement.append(this.audioGamePage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'none';
        },
      },
      {
        name: '/test',
        component: () => {
          this.testPage = new AuthTestContainer(this.rootElement);
          this.rootElement.append(this.testPage.element);
          (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
        },
      },
    ];

    this.defaultRoute = {
      name: 'Default router',
      component: () => {
        this.rootElement.innerHTML = '404. Page not found.';
        (document.querySelector('.footer') as HTMLDivElement).style.display = 'flex';
      },
    };
  }

  updateRouter(): void {
    this.rootElement.innerHTML = '';
    const currentRouteName = window.location.hash.slice(1);
    const currentRoute = this.routes.find(
      (page) => page.name === currentRouteName,
    );

    (currentRoute || this.defaultRoute).component();
  }

  initRouter(): void {
    if (window.location.hash === '') {
      window.location.hash = '#/';
    }

    window.onpopstate = () => this.updateRouter();
    this.updateRouter();
  }
}

export default Router;
