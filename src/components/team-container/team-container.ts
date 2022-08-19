import Component from '../../utils/component';

import './index.scss';

class TeamContainer extends Component {
  // private container: Component;

  private title: Component;

  private content: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['team-container']);

    this.title = new Component(this.element, 'h2');
    this.title.element.innerHTML = 'This is a team page';
    // this.container = new Component(this.element, 'div', ['team-container']);
    this.content = new Component(this.element, 'div', ['team-content']);
  }

  private clear() {
    // this.container.element.innerHTML = '';
    this.content.element.innerHTML = '';
  }
}

export default TeamContainer;
