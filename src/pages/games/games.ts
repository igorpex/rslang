import Component from '../../utils/component';
import GamesContainer from '../../components/games-container/games-container';

class Games extends Component {
  private gamesContainer: GamesContainer;

  private audioChallengeBox: Component | undefined;

  private sprintBox: Component | undefined;

  private audioChallengeBoxTitle: Component | undefined;

  private sprintBoxTitle: Component | undefined;

  private gamesContent: Component | undefined;
  // gamesContainer = new TeamContainer(this.element);

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['games']);
    this.gamesContainer = new GamesContainer(this.element);
  }
}

export default Games;
