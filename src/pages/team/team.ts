import Component from '../../utils/component';
import TeamContainer from '../../components/team-container/team-container';

class Team extends Component {
  private teamContainer: TeamContainer;

  private teamContent: Component | undefined;
  // teamContainer = new TeamContainer(this.element);

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['team']);
    this.teamContainer = new TeamContainer(this.element);
    console.log('team');
  }
}

export default Team;
