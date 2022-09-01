import Component from '../../utils/component';

import './index.scss';

class SprintEntrance extends Component {
  private content:Component;

  public difficulty: number | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-entrance']);

    this.content = new Component(this.element, 'div', ['sprint-entrance__content']);

    this.content.element.innerHTML = this.pageContent;

    // this.loginForm.element.addEventListener('submit', (e) => this.handleChoose(e));
  }

  // callback comes from sprint.ts and leads to sprint.prepareGame()
  public chooseDifficulty(callback: Function) {
    const difficultyForm = document.getElementById('sprint__difficulty-form');
    difficultyForm!.addEventListener('submit', (e) => this.handleSubmitDifficulty(e, callback));
  }

  // handle submit difficulty
  private async handleSubmitDifficulty(e: Event, callback: Function) {
    e.preventDefault();
    // Get data from form
    const form = e.target as HTMLFormElement;
    const difficulty = (form.querySelector('#sprint__difficulty-input') as HTMLInputElement).value;
    this.difficulty = +difficulty - 1;
    callback(); // leads to sprint.prepareGame()
  }

  // form2 = new Component(this.element, 'form', ['difficulty__form']);

  private form = `<form id="sprint__difficulty-form">
            <select name="difficulty" id="sprint__difficulty-input">
                <option value="1">1 - обезьянка</option>
                <option value="2">2 - новичек</option>
                <option value="3">3 - ученик</option>
                <option value="4">4 - мыслитель</option>
                <option value="5">5 - кандидат</option>
                <option value="6">6 - эксперт</option>
          </select>
             <button id="sprint__difficulty-btn" type="submit">Начать</button>
        </form>`;

  private pageContent = `
    <h1>Спринт</h1>
    <div>
        <p>«Спринт» - это тренировка для повторения заученных слов из вашего словаря.</p>
        <ul>
            <li>Используйте мышь, чтобы выбрать.</li>
            <li>Используйте клавиши влево или вправо</li>
        </ul>
        <p>Выберите сложность</p>
        ${this.form}
    </div>
    `;

  private clear() {
    this.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintEntrance;
