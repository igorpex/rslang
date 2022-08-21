import App from './app';
import './index.scss';

window.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.body;
  const app = new App(rootElement);

  app.init();
});
