import Component from '../../utils/component';
import UIButton from '../UI/button/button';
import { SprintCounts, SprintWord } from '../../interfaces';
import { baseUrl } from '../../api/api';
import playButtonImg from '../../assets/svg/play-button.svg';

class SprintCard extends Component {
  private cardWord: Component | undefined;

  private cardTranslation: Component;

  private cardButtons: Component;

  cardRightBtn: UIButton;

  cardWrongBtn: UIButton;

  sprintWord: SprintWord;

  private cardBirdsContainer: Component;

  private cardTotalPoints: Component;

  private cardDotsContainer: Component;

  // private wordAudio: Component;
  private playAudioBtn: Component;

  constructor(parentNode: HTMLElement, sprintWord: SprintWord, sprintCounts: SprintCounts) {
    super(parentNode, 'div', ['sprint__card']);
    this.sprintWord = sprintWord;

    this.cardTotalPoints = new Component(this.element, 'p', ['sprint__card-total-points'], `Всего очков: ${sprintCounts.totalPoints}`);

    const wordAudio = new Audio(`${baseUrl}/${this.sprintWord.audio}`);
    // console.log(this.sprintWord);
    this.playAudioBtn = new Component(this.element, 'img', ['sprint__card-audio-btn']);
    this.playAudioBtn.element.setAttribute('src', playButtonImg);

    this.playAudioBtn.element.addEventListener('click', () => wordAudio.play());

    // dots showing correct answers after mulpiplier upgrade
    this.cardDotsContainer = new Component(this.element, 'div', ['sprint__card-dots-container']);
    // const cardDotsCount = new Component(this.element, 'p', ['sprint__card-dots-count'], `Закрашенных точек (от 0 до 3, означают правильные ответы с этим множителем): ${sprintCounts.dots}`); // TODO Delete
    for (let i = 1; i <= 3; i += 1) {
      const cardDot = new Component(this.cardDotsContainer.element, 'div', ['sprint__card-dot']);
      if (i <= sprintCounts.dots) {
        cardDot.element.classList.add('sprint__card-dot_active');
      }
    }
    if (sprintCounts.birds >= 2) {
      const cardBirdsCount = new Component(this.element, 'p', ['sprint__card-per-answer-count'], `+${sprintCounts.pointsPerCorrectAnswer} очков за слово`);
    } else {
      const cardBirdsCount = new Component(this.element, 'p', ['sprint__card-per-answer-count']);
    }

    // Birds means scores multiplier
    this.cardBirdsContainer = new Component(this.element, 'div', ['sprint__card-birds-container']);
    for (let i = 1; i <= sprintCounts.birds; i += 1) {
      const cardBird = new Component(this.cardBirdsContainer.element, 'div', ['sprint__card-bird', `sprint__card-bird-${i}`]);
    }

    // <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M15.788 13.007a3 3 0 110 5.985c.571 3.312 2.064 5.675 3.815 5.675 2.244 0 4.064-3.88 4.064-8.667 0-4.786-1.82-8.667-4.064-8.667-1.751 0-3.244 2.363-3.815 5.674zM19 26c-3.314 0-12-4.144-12-10S15.686 6 19 6s6 4.477 6 10-2.686 10-6 10z" fill-rule="evenodd"></path></svg>

    this.cardWord = new Component(this.element, 'p', ['sprint__card-word'], `${this.sprintWord.word}`);
    this.cardTranslation = new Component(this.element, 'p', ['sprint__card-translation'], `${this.sprintWord.proposedTranslate}`);
    this.cardButtons = new Component(this.element, 'div', ['sprint__card-buttons']);
    this.cardWrongBtn = new UIButton(this.cardButtons.element, ['sprint__wrong-btn'], 'Неверно');
    this.cardRightBtn = new UIButton(this.cardButtons.element, ['sprint__right-btn'], 'Верно');

    this.cardRightBtn.onClickButton = () => this.cardRightBtn.onClickButton();
    this.cardWrongBtn.onClickButton = () => this.cardWrongBtn.onClickButton();
  }
}

export default SprintCard;
