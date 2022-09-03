import Component from '../../utils/component';

import './index.scss';
import UIButton from '../UI/button/button';

type GameType = 'menu' | 'ebook';

class SprintEntrance extends Component {
  private content:Component;

  public difficulty: number | undefined;

  public type: string | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-entrance']);

    const params = new URLSearchParams(document.location.search);
    const ref = params.get('ref');
    let type = 'menu';
    let next = '';
    if (ref) {
      next = ref.slice(1);
      type = 'ebook';
    }
    this.type = type;

    this.content = new Component(this.element, 'div', ['sprint-entrance__content']);
    this.createPageContent();

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

  createForm = (defDifficulty = 0, disabled = false) => {
    const form = new Component(null, 'form', ['sprint__difficulty-form']);
    form.element.id = 'sprint__difficulty-form';
    const select = new Component(form.element, 'select', ['sprint__difficulty-form']);
    select.element.id = 'sprint__difficulty-input';
    select.element.setAttribute('name', 'difficulty');
    const levels = ['1 - обезьянка', '2 - новичек', '3 - ученик', '4 - мыслитель', '5 - кандидат', '6 - эксперт', '7 - свои слова'];
    levels.forEach((difficulty, index) => {
      const option = new Component(select.element, 'option', ['sprint__difficulty-option'], difficulty);
      option.element.setAttribute('value', `${index + 1}`);
      if (index === defDifficulty) { option.element.setAttribute('selected', 'selected'); }
    });

    const difficultyBtn = new UIButton(form.element, ['sprint__difficulty-btn'], 'Начать');
    difficultyBtn.element.setAttribute('type', 'submit');
    difficultyBtn.element.id = 'sprint__difficulty-btn';
    return form.element;
  };

  createPageContent = () => {
    const title = new Component(this.content.element, 'h1', ['sprint-entrance__title'], 'Спринт');
    const contentBox = new Component(this.content.element, 'div', ['sprint-entrance__box']);
    contentBox.element.innerHTML = `
        <p>«Спринт» - это тренировка для повторения заученных слов из вашего словаря.</p>
        <ul>
            <li>Используйте мышь, чтобы выбрать.</li>
            <li>Используйте клавиши влево или вправо</li>
        </ul>
        <p>Выберите сложность</p>`;
    contentBox.element.append(this.createForm());
  };

  private clear() {
    this.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintEntrance;
