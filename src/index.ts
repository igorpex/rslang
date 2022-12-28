import App from './app';
import './index.scss';
import favicon from './assets/img/favicon.png';

window.addEventListener('DOMContentLoaded', () => {
  const $favicon = document.createElement('link');
  $favicon.rel = 'shortcut icon';
  $favicon.href = favicon;
  $favicon.setAttribute('type', 'image/x-icon');
  document.head.appendChild($favicon);

  const rootElement = document.body;
  const app = new App(rootElement);

  app.init();
});
