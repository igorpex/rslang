import Component from './utils/component';
import Router from './router/index';
import Header from './components/header/header';
import Footer from './components/footer/footer';

class App {
  private main;

  private router;

  constructor(private rootElement: HTMLElement) {
    const header = new Header(this.rootElement);
    this.main = new Component(this.rootElement, 'main', ['main']);
    const footer = new Footer(this.rootElement);

    this.router = new Router(this.main.element);
  }

  init(): void {
    this.router.initRouter();
  }
}

export default App;
