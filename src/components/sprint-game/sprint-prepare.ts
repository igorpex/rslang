import Component from '../../utils/component';

import './index.scss';

class SprintPrepare extends Component {
  private content:Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-prepare']);

    this.content = new Component(this.element, 'div', ['sprint-game__prepare']);

    for (let i = 3; i >= 0; i -= 1) {
      setTimeout(() => { this.content.element.innerHTML = `<h1 class='sprint-game__prepare-title'>Приготовиться: ${i}</h1>`; }, (3 - i) * 1000);
    }
  }

  public prepare(callback: Function) {
    setTimeout(callback, 3200);
  }
}

export default SprintPrepare;
