import { IRoute } from '../interfaces';
import Component from '../utils/component';
import Main from '../pages/main/main';
import Team from '../pages/team/team';

class Router {
  private readonly routes: Array<IRoute>;

  private defaultRoute: IRoute;

  // Pages
  mainPage: Component;

  teamPage: Component | undefined;

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
