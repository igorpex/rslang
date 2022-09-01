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

class Router {
  private readonly routes: Array<IRoute>;

  private defaultRoute: IRoute;

  // Pages
  mainPage: Component;

  teamPage: Component | undefined;

  bookPage: Component | undefined;

  loginPage: Component | undefined;

  signupPage: Component | undefined;

  gamesPage: Component | undefined;

  sprintPage: Component | undefined;

  testPage: Component | undefined;


  constructor(private rootElement: HTMLElement) {
    this.mainPage = new Main(this.rootElement);

    this.routes = [
      {
        name: '/',
        component: () => {
          this.rootElement.append(this.mainPage.element);
        },
      },
      {
        name: '/team',
        component: () => {
          this.teamPage = new Team(this.rootElement);
          this.rootElement.append(this.teamPage.element);
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
        name: '/ebook',
        component: () => {
          this.bookPage = new Book(this.rootElement);
          this.rootElement.append(this.bookPage.element);
        },
      },
      {
        name: '/login',
        component: () => {
          this.loginPage = new Login(this.rootElement);
          this.rootElement.append(this.loginPage.element);
        },
      },
      {
        name: '/signup',
        component: () => {
          this.signupPage = new SignupContainer(this.rootElement);
          this.rootElement.append(this.signupPage.element);
        },
      },
      {
        name: '/games',
        component: () => {
          this.gamesPage = new Games(this.rootElement);
          this.rootElement.append(this.gamesPage.element);
        },
      },
      {
        name: '/games/sprint',
        component: () => {
          this.sprintPage = new Sprint(this.rootElement);
          this.rootElement.append(this.sprintPage.element);
        },
      },
      {
        name: '/test',
        component: () => {
          this.testPage = new AuthTestContainer(this.rootElement);
          this.rootElement.append(this.testPage.element);
        },
      },
    ];

    this.defaultRoute = {
      name: 'Default router',
      component: () => {
        this.rootElement.innerHTML = '404. Page not found.';
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
