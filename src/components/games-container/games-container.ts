import Component from '../../utils/component';
import './index.scss';

class GamesContainer extends Component {
  private audioChallengeBox: Component | undefined;

  private sprintBox: Component | undefined;

  private audioChallengeBoxTitle: Component | undefined;

  private sprintBoxTitle: Component | undefined;

  private gamesBox: Component;

  private image: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['games-container']);
    this.gamesBox = new Component(this.element, 'div', ['games__box']);
    // this.gamesContainer = new GamesContainer(this.element);
    this.audioChallengeBox = new Component(this.gamesBox.element, 'div', ['games__game', 'games__game_audio-challenge']);
    this.sprintBox = new Component(this.gamesBox.element, 'div', ['games__game', 'games__game_sprint']);

    this.audioChallengeBoxTitle = new Component(this.audioChallengeBox.element, 'h2', ['games__game-title']);
    this.sprintBoxTitle = new Component(this.sprintBox.element, 'h2', ['games__game-title']);

    this.audioChallengeBoxTitle.element.innerHTML = '<a class="games__game-link" href="#/games/audio-challenge">Аудиовызов</a>';
    this.sprintBoxTitle.element.innerHTML = '<a class="games__game-link" href="#/games/sprint">Спринт</a>';

    this.image = new Component(this.element, 'div', ['games__image']);
  }

  private clear() {
    // this.container.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default GamesContainer;
