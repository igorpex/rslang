import { Word } from '../../interfaces';
import Component from '../../utils/component';
import UIButton from '../UI/button/button';

class GameOptions extends Component {
  startSprintGame: () => void = () => {};

  startAudioGame: () => void = () => {};

  openDictionary: () => void = () => {};

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['book-options__game']);

    const gameHeader = new Component(this.element, 'div', ['game__header']);
    const headerIcon = new Component(gameHeader.element, 'span', ['game-header__icon']);
    headerIcon.element.style.backgroundImage = 'url(./video-game-icon.svg)';
    const headerTitle = new Component(gameHeader.element, 'p', ['game-header__title'], 'Мини-игры');
    const headerBtn = new Component(gameHeader.element, 'span', ['game-header__btn']);
    headerBtn.element.style.backgroundImage = 'url(./down-arrow.svg)';
    const gameList = new Component(this.element, 'ul', ['game__list']);
    gameList.element.classList.add('hidden');

    const sprintBtn = new Component(gameList.element, 'li', ['list__item']);
    const sprintLink = new Component(sprintBtn.element, 'a', ['sprint__link'], 'Спринт');
    sprintLink.element.setAttribute('href', '#/sprint');
    const audioGameBtn = new Component(gameList.element, 'li', ['list__item'], '');
    const audioGameLink = new Component(audioGameBtn.element, 'a', ['audio-game__link'], 'Аудиовызов');
    audioGameLink.element.setAttribute('href', '#/audioGame');

    this.element.addEventListener('click', () => {
      gameList.element.classList.toggle('hidden');
    });
    sprintBtn.element.addEventListener('click', () => {
      gameList.element.classList.remove('hidden');
    });
    audioGameBtn.element.addEventListener('click', () => {
      gameList.element.classList.remove('hidden');
    });
    // sprintBtn.onClickButton = () => {
    //     this.startSprintGame();
    //     console.log('start');
    // }
    // audioGameBtn.onClickButton = () => this.startAudioGame();
    // dictionaryBtn.onClickButton = () => this.openDictionary();
  }
}

export default GameOptions;
