import Component from '../../utils/component';

import './index.scss';

class SprintContainer extends Component {
  private container:Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-wrapper']);
    this.container = new Component(this.element, 'div', ['sprint-container']);
  }

  private clear() {
    this.container.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintContainer;
