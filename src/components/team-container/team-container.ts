import { ITeam } from '../../interfaces';
import Component from '../../utils/component';

import './index.scss';
import TeamItem from './teamItem';
import team from './teamlist';

class TeamContainer extends Component {
  // private container: Component;

  private title: Component;

  private content: Component;
  private aboutProject: Component;
  team: ITeam[];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['team-container']);
    this.team = team;

    // this.container = new Component(this.element, 'div', ['team-container']);
    this.aboutProject = new Component(this.element, 'div', ['project-content']);
    const projectTitle = new Component(this.aboutProject.element, 'h2', ['project__title'], 'About our project');
    const projectDiscription =  new Component(this.aboutProject.element, 'p', ['project__discription'], '');
    projectDiscription.element.innerHTML = "This is.................................."
    this.content = new Component(this.element, 'div', ['team-content']);
    this.title = new Component(this.content.element, 'h2', ['team__title']);
    this.title.element.innerHTML = 'Our team';
    const contentItems = new Component(this.content.element, 'div', ['team__list']);

    this.team.forEach((member) => {
      const item = new TeamItem(contentItems.element, member);
    })
  }

  private clear() {
    // this.container.element.innerHTML = '';
    this.content.element.innerHTML = '';
  }
}

export default TeamContainer;
