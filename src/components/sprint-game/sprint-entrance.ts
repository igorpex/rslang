import Component from '../../utils/component';

import './index.scss';

class SprintEntrance extends Component {
  private content:Component;

  public difficulty: number | undefined;

  private levelDifficulty: number;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-entrance']);

    this.content = new Component(this.element, 'div', ['sprint-entrance__content']);

    this.content.element.innerHTML = this.pageContent;

    this.levelDifficulty = 1;

    (document.querySelector('.select') as HTMLElement).addEventListener('click', (e: MouseEvent) => {
      (document.querySelector('#select__options') as HTMLElement).classList.toggle('active');
      if ((e.target as HTMLElement).className.includes('difficulty')) {
        (document.querySelector('.select__current-option') as HTMLElement).innerHTML = (e.target as HTMLElement).innerHTML;
        this.levelDifficulty = Number((e.target as HTMLElement).getAttribute('difficulty'));
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
    callback(); // leads to sprint.prepareGame()
  }

  // form2 = new Component(this.element, 'form', ['difficulty__form']);

    private form = `<form id="sprint__difficulty-form">
            <div class='select'>
              <div class='select__wrapper'>
                <div class='select__img'></div>
                <p class='select__current-option'>НОВИЧОК</p>
                <div class='select__arrow'></div>
              </div>
              <div id='select__options' class='select__options'>
                  <p class='select__option difficulty' difficulty='1'>НОВИЧОК</p>
                  <p class='select__option difficulty' difficulty='2'>УЧЕНИК</p>
                  <p class='select__option difficulty' difficulty='3'>МЫСЛИТЕЛЬ</p>
                  <p class='select__option difficulty' difficulty='4'>КАНДИДАТ</p>
                  <p class='select__option difficulty' difficulty='5'>МАСТЕР</p>
                  <p class='select__option difficulty' difficulty='6'>ЭКСПЕРТ</p>
              </div>
            </div>
            
             <button id="sprint__difficulty-btn" type="submit">НАЧАТЬ</button>
        </form>`;

  private pageContent = `
    <div class='sprint__description-container'>
      <h2 class='sprint__title'>Спринт</h2>
      <div>
          <p class='sprint__description'>«Спринт» - это тренировка для повторения заученных слов из вашего словаря.</p>
          <ul class='sprint__description2'>
              <li>Используйте мышь, чтобы выбрать;</li>
              <li>Используйте клавиши влево или вправо.</li>
          </ul>
      </div>
      <div>
        <p class='sprint__difficulty-text'>Выберите сложность</p>
        ${this.form}
      </div>
    </div>
    `;

  private clear() {
    this.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintEntrance;
