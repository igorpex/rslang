import Component from '../../utils/component';
import UIButton from '../UI/button/button';
import { SprintCounts, SprintWord } from '../../interfaces';

class SprintCard extends Component {
  private cardWord: Component;

  private cardTranslation: Component;

  private cardButtons: Component;

  cardRightBtn: UIButton;

  cardWrongBtn: UIButton;

  sprintWord: SprintWord;

  private cardBirdsContainer: Component;

  private cardTotalPoints: Component;

  private cardDotsContainer: Component;

  constructor(parentNode: HTMLElement, sprintWord: SprintWord, sprintCounts: SprintCounts) {
    super(parentNode, 'div', ['sprint__card']);
    this.sprintWord = sprintWord;

    this.cardTotalPoints = new Component(this.element, 'p', ['sprint__card-total-points'], `Всего очков: ${sprintCounts.totalPoints}`);

    // dots showing correct answers after mulpiplier upgrade
    this.cardDotsContainer = new Component(this.element, 'div', ['sprint__card-dots-container']);
    // const cardDotsCount = new Component(this.element, 'p', ['sprint__card-dots-count'], `Закрашенных точек (от 0 до 3, означают правильные ответы с этим множителем): ${sprintCounts.dots}`); // TODO Delete
    for (let i = 1; i <= 3; i += 1) {
      const cardDot = new Component(this.element, 'div', ['sprint__card-dot']);
      if (i <= sprintCounts.dots) {
        cardDot.element.classList.add('sprint__card-dot_active');
      }
    }
    if (sprintCounts.birds >= 2) {
      const cardBirdsCount = new Component(this.element, 'p', ['sprint__card-per-answer-count'], `+${sprintCounts.pointsPerCorrectAnswer} очков за слово`); // TODO Delete
    }

    // const cardBirdsCount = new Component(this.element, 'p', ['sprint__card-birds-count'], `Птиц на ветке(означают множитель): ${sprintCounts.birds}`); // TODO Delete
    this.cardBirdsContainer = new Component(this.element, 'div', ['sprint__card-birds-container']);
    for (let i = 1; i <= sprintCounts.birds; i += 1) {
      const cardBird = new Component(this.cardBirdsContainer.element, 'div', ['sprint__card-bird', `sprint__card-bird-${i}`]);
    }

    this.cardWord = new Component(this.element, 'div', ['sprint__card-total-points'], `${sprintCounts.totalPoints}`);
    this.cardWord = new Component(this.element, 'p', ['sprint__card-word'], `${this.sprintWord.word}`);
    this.cardTranslation = new Component(this.element, 'p', ['sprint__card-translation'], `${this.sprintWord.proposedTranslate}`);
    this.cardButtons = new Component(this.element, 'div', ['sprint__card-buttons']);
    this.cardWrongBtn = new UIButton(this.cardButtons.element, ['sprint__right-btn'], 'Неверно');
    this.cardRightBtn = new UIButton(this.cardButtons.element, ['sprint__right-btn'], 'Верно');

    this.cardRightBtn.onClickButton = () => this.cardRightBtn.onClickButton();
    this.cardWrongBtn.onClickButton = () => this.cardWrongBtn.onClickButton();
  }
}

export default SprintCard;
