import Component from '../../utils/component';
import Igor from '../../assets/img/Igor.png';
import Sasha from '../../assets/img/Sasha.png';
import Vlad from '../../assets/img/Vlad.png';

import './index.scss';

class TeamContainer extends Component {
  // private container: Component;

  private title: Component;

  private content: Component;
  
  private cards: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['team-container']);

    this.title = new Component(this.element, 'h2', ['team__title']);
    this.title.element.innerHTML = 'О команде';
    // this.container = new Component(this.element, 'div', ['team-container']);
    this.content = new Component(this.element, 'div', ['team-content']);
    this.cards = new Component(this.content.element, 'div', ['team-content__cards']);

    const photos = [Igor, Sasha, Vlad];
    const names = ['Игорь Богданов', 'Александра Пехота', 'Владислав Королев'];
    const names2 = ['Я занимался координацией команды, настроил серверную часть приложения, реализовал авторизацию и разавторизацию, создал игру "Спринт" и раздел "Статистика", также занимался реализацией отправки данных на сервер.', 'Я реализовала игру "Аудиовызов" и раздел "Электронный учебник", а также занималась реализацией отправки данных на сервер.', 'Я разработал дизайн проекта, создал хедер с навигацией и футер, а также страницы "Главная" и "О команде".'];
    const github = ['igorpex', 'takeAmoment', 'Vladislav122-kor'];
    const links = ['https://github.com/igorpex', 'https://github.com/takeAmoment', 'https://github.com/Vladislav122-kor'];

    for (let i = 0; i < photos.length; i += 1) {
      const card = new Component(this.cards.element, 'div', ['team-content__card']);

      const img = document.createElement('img');
      img.classList.add('team-content__card-photo');
      img.src = photos[i];
      card.element.appendChild(img);

      const name = document.createElement('p');
      name.classList.add('team-content__card-name');
      name.innerHTML = names[i];
      card.element.appendChild(name);

      const position = document.createElement('p');
      position.classList.add('team-content__card-position');
      position.innerHTML = 'Разработчик';
      card.element.appendChild(position);

      const contr = document.createElement('p');
      contr.classList.add('team-content__card-contr');
      contr.innerHTML = names2[i];
      card.element.appendChild(contr);

      const gitHubWrapper = document.createElement('div');
      gitHubWrapper.classList.add('team-content__card-git-wrap');
      card.element.appendChild(gitHubWrapper);

      const gitIcon = document.createElement('div');
      gitIcon.classList.add('team-content__card-git-icon');
      gitHubWrapper.appendChild(gitIcon);

      const gitName = document.createElement('a');
      gitName.classList.add('team-content__card-git-name');
      gitName.innerHTML = github[i];
      gitName.href = links[i];
      gitHubWrapper.appendChild(gitName);
    }
  }

  private clear() {
    // this.container.element.innerHTML = '';
    this.content.element.innerHTML = '';
  }
}

export default TeamContainer;
