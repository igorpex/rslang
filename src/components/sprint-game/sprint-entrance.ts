/* eslint-disable @typescript-eslint/no-unused-vars */
import Component from '../../utils/component';

import './index.scss';

// type GameType = 'menu' | 'ebook';

class SprintEntrance extends Component {
  private content:Component;

  public difficulty: number | undefined;

  private levelDifficulty: number;

  // public refererType: string | undefined;

  refererType = 'menu';

  private next: string | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-entrance']);

    const params = new URLSearchParams(document.location.search);
    const ref = params.get('ref');
    let refererType = 'menu';
    let next = '';
    if (ref) {
      next = ref.slice(1);
      console.log(next);
      refererType = 'ebook';
    }
    this.refererType = refererType;
    this.next = next;
    console.log('Entrance this.refererType:', this.refererType);

    this.content = new Component(this.element, 'div', ['sprint-entrance__content']);

    this.content.element.innerHTML = this.pageContent;
    this.content.element.append(this.getForm().element);

    this.levelDifficulty = 1;

    (document.querySelector('.sprint__select') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      (document.querySelector('.sprint__select-options') as HTMLElement).classList.toggle('active');
      if ((e.target as HTMLElement).className.includes('difficulty')) {
        (document.querySelector('.sprint__select-current-option') as HTMLElement).innerHTML = (e.target as HTMLElement).innerHTML;
        this.levelDifficulty = Number((e.target as HTMLElement).getAttribute('data-difficulty'));
      }
    });
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
    this.difficulty = this.levelDifficulty - 1;
    // if (this.refererType === 'menu') {
    //   this.difficulty = this.levelDifficulty - 1;
    // }
    callback(); // leads to sprint.prepareGame()
  }

  // form2 = new Component(this.element, 'form', ['difficulty__form']);
  getForm = () => {
    const formCont = new Component(null, 'div', ['sprint__form-cont']);
    const difficultyText = new Component(formCont.element, 'p', ['sprint__difficulty-text'], 'Выберите сложность');
    const form = new Component(formCont.element, 'form', ['sprint__difficulty-form']);
    form.element.id = 'sprint__difficulty-form';
    const select = new Component(form.element, 'div', ['sprint__select']);
    const selectWrapper = new Component(select.element, 'div', ['sprint__select-wrapper']);
    const selectImg = new Component(selectWrapper.element, 'div', ['sprint__select-img']);
    const selectCurOpt = new Component(selectWrapper.element, 'p', ['sprint__select-current-option'], 'НОВИЧОК');
    const selectArr = new Component(selectWrapper.element, 'div', ['sprint__select-arrow']);
    const selectOptions = new Component(select.element, 'div', ['sprint__select-options']);
    selectOptions.element.id = 'sprint__select-options';
    const arr = ['НОВИЧОК', 'УЧЕНИК', 'МЫСЛИТЕЛЬ', 'КАНДИДАТ', 'МАСТЕР', 'ЭКСПЕРТ'];
    arr.forEach((name, index) => {
      const option = new Component(selectOptions.element, 'p', ['sprint__select-option', 'difficulty'], `${name}`);
      option.element.dataset.difficulty = `${index + 1}`;
      option.element.setAttribute('difficulty', `${index + 1}`);
    });
    const difficultyBtn = new Component(form.element, 'button', ['sprint__difficulty-btn'], 'НАЧАТЬ');
    difficultyBtn.element.id = 'sprint__difficulty-btn';
    difficultyBtn.element.setAttribute('type', 'submit');
    if (this.refererType === 'ebook') {
      select.element.style.display = 'none';
      difficultyText.element.style.display = 'none';
      select.element.style.display = 'none';
      difficultyBtn.element.style.display = 'flex';
    }
    return formCont;
  };

  private pageContent = `
    <div class='sprint__description-container'>
      <h2 class='sprint__title'>Спринт</h2>
      <div class='sprint__description-container'>
          <p class='sprint__description'>«Спринт» - это тренировка для повторения заученных слов из вашего словаря.</p>
          <ul class='sprint__description2'>
              <li>- используйте мышь, чтобы выбрать;</li>
              <li>- используйте клавиши влево или вправо.</li>
          </ul>
      </div>
    </div>
    `;

  private clear() {
    this.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintEntrance;
