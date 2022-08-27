import Component from '../../utils/component';

import './index.scss';

class GamesContainer extends Component {
  private audioChallengeBox: Component | undefined;

  private sprintBox: Component | undefined;

  private audioChallengeBoxTitle: Component | undefined;

  private sprintBoxTitle: Component | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['games-container']);

    // this.gamesContainer = new GamesContainer(this.element);
    this.audioChallengeBox = new Component(this.element, 'div', ['games__box', 'games__box_audio-challenge']);
    this.sprintBox = new Component(this.element, 'div', ['games__box', 'games__box_sprint']);

    this.audioChallengeBoxTitle = new Component(this.audioChallengeBox.element, 'h2', ['games__box-title']);
    this.sprintBoxTitle = new Component(this.sprintBox.element, 'h2', ['games__box-title']);

    this.audioChallengeBoxTitle.element.innerHTML = '<a href="#/games/audio-challenge">Аудиовызов</a>';
    this.sprintBoxTitle.element.innerHTML = '<a href="#/games/sprint">Спринт</a>';
  }

  private clear() {
    // this.container.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default GamesContainer;
