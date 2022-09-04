import Component from '../../utils/component';

import './index.scss';
import {
  ShortWord, SprintCounts, SprintWord,
} from '../../interfaces';
import SprintCard from './card';
import Timer from './timer';

import updateWordStatistics from '../shared/updateUserWord/updateUserWord';

class SprintGame extends Component {
  private content:Component;

  public words: ShortWord[] | undefined;

  auth: boolean | undefined;

  private correctIndexes: number[] | undefined;

  private sprintWords: SprintWord[] | undefined;

  card: SprintCard | undefined;

  private cardWord: Component | undefined;

  private activeWordIndex: number ;

  private cardTranslation: Component | undefined;

  private cardButtons: Component | undefined;

  private beepSoundEnabled: boolean;

  public rightAnsweredWords: ShortWord[];

  public wrongAnsweredWords: ShortWord[];

  private minPointsPerCorrectAnswer: number;

  private maxPointsPerCorrectAnswer: number;

  public sprintCounts: SprintCounts;

  private beepSoundIcon: Component ;

  private topContainer: Component | undefined;

  private timer: Timer | undefined;

  private closeBtn: Component | undefined;

  private title: Component;

  soundCloseContainer: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-game']);

    this.topContainer = new Component(this.element, 'div', ['sprint-game__top']);
    this.content = new Component(this.element, 'div', ['sprint-game__content']);
    this.beepSoundEnabled = true; // TODO add changer
    this.activeWordIndex = 0;
    this.minPointsPerCorrectAnswer = 10;
    this.maxPointsPerCorrectAnswer = 80;
    this.rightAnsweredWords = [];
    this.wrongAnsweredWords = [];

    this.sprintCounts = {
      pointsPerCorrectAnswer: 10,
      totalPoints: 0,
      rightInTheRow: 0,
      maxRightInTheRow: 0,
      dots: 0, // rightInTheRow % 4
      birds: 1, // rightInTheRow / 4 + 1;
    };

    // this.timer = new Component(this.topContainer.element, 'div', ['sprint-game__timer'], '60');
    this.timer = new Timer(this.topContainer.element);
    this.title = new Component(this.topContainer.element, 'p', ['sprint-game__title'], 'Выберите “Верно” или “Неверно”');
    this.soundCloseContainer = new Component(this.topContainer.element, 'div', ['sprint-game__sound-close-container']);
    this.beepSoundIcon = new Component(this.soundCloseContainer.element, 'div', ['sprint-game__beep-sound-icon']);
    this.updateBeepSoundIcon();
    this.beepSoundIcon.element.addEventListener('click', this.toggleBeepSoundStatus);
    this.closeBtn = new Component(this.soundCloseContainer.element, 'a', ['sprint-game__close-btn']);
    this.closeBtn.element.setAttribute('href', '#/games/sprint');

    // switch off the timer by clicking on the closeBtn
    this.closeBtn.element.addEventListener('click', () => {
      this.clear();
    });

    // switch off the timer by clicking on any link
    window.addEventListener('click', (e: MouseEvent) => {
      const listOfLinkClasses = ['nav__item', 'logo', 'login', 'logout'];
      listOfLinkClasses.forEach((elem) => {
        if ((e.target as HTMLElement).className.includes(elem)) {
          this.clear();
        }
      });
    });
  }

  private toggleBeepSoundStatus = () => {
    this.beepSoundEnabled = !this.beepSoundEnabled;
    this.updateBeepSoundIcon();
  };

  private updateBeepSoundIcon = () => {
    if (this.beepSoundEnabled) { this.beepSoundIcon.element.classList.add('sprint-game__beep-sound_active'); } else {
      this.beepSoundIcon.element.classList.remove('sprint-game__beep-sound_active');
    }
  };

  /**
   * Starts game.
   */
  public start(finishCallback: Function) {
    // console.log('Words to play:', this.words);
    // Prepare words
    const len = this.words!.length;
    this.correctIndexes = this.chooseCorrect(len);
    this.sprintWords = this.generateMixCorrectAndIncorrect();
    this.createCard();
    this.timer!.start(finishCallback);
  }

  private createCard() {
    this.content.element.innerHTML = '';
    this.card = new SprintCard(
      this.content.element,
      this.sprintWords![this.activeWordIndex],
      this.sprintCounts,
    );
    this.card.cardWrongBtn.onClickButton = () => {
      this.card?.cardWrongBtn.setDisabled(true);
      this.card?.cardRightBtn.setDisabled(true);
      this.card?.cardRightBtn.element.classList.add('active');
      if (!this.card?.sprintWord.correctFlag) {
        this.processCorrectAnswer();
      } else this.processWrongAnswer();
    };

    this.card.cardRightBtn.onClickButton = () => {
      this.card?.cardRightBtn.setDisabled(true);
      this.card?.cardWrongBtn.setDisabled(true);
      this.card?.cardWrongBtn.element.classList.add('active');
      if (this.card?.sprintWord.correctFlag === 1) {
        this.processCorrectAnswer();
      } else this.processWrongAnswer();
    };
  }
  
  private async processCorrectAnswer() {
    this.card?.element.classList.add('sprint__card_right-answer');
    // this.updateWordStatistics('right', this.sprintWords![this.activeWordIndex]);
    await updateWordStatistics('sprint', 'right', this.sprintWords![this.activeWordIndex]);

    setTimeout(this.createCard.bind(this), 800);
    if (this.beepSoundEnabled) {
      const audio = new Audio('./audio/audioRightAnswer.mp3');
      audio.play();
    }
    this.rightAnsweredWords.push(this.sprintWords![this.activeWordIndex]);
    this.activeWordIndex += 1;

    // update counts on correct answer
    this.sprintCounts.totalPoints += this.sprintCounts.pointsPerCorrectAnswer;
    this.sprintCounts.rightInTheRow += 1;
    this.sprintCounts.maxRightInTheRow = Math.max(
      this.sprintCounts.maxRightInTheRow,
      this.sprintCounts.rightInTheRow,
    );

    // calc point per next correct answer
    this.sprintCounts.pointsPerCorrectAnswer = Math.min(
      this.minPointsPerCorrectAnswer * (2 ** Math.floor(this.sprintCounts.rightInTheRow / 4)),
      this.maxPointsPerCorrectAnswer,
    );
    this.sprintCounts.dots = Math.floor(this.sprintCounts.rightInTheRow % 4);
    this.sprintCounts.birds = (Math.floor(this.sprintCounts.rightInTheRow / 4)) + 1;
  }

  private async processWrongAnswer() {
    console.log('Wrong answer!');
    this.card?.element.classList.add('sprint__card_wrong-answer');
    // this.updateWordStatistics('wrong', this.sprintWords![this.activeWordIndex]);
    await updateWordStatistics('sprint', 'wrong', this.sprintWords![this.activeWordIndex]);
    setTimeout(this.createCard.bind(this), 800);
    if (this.beepSoundEnabled) {
      const audio = new Audio('./audio/audioWrongAnswer.mp3');
      audio.play();
    }
    this.wrongAnsweredWords.push(this.sprintWords![this.activeWordIndex]);
    this.sprintCounts.pointsPerCorrectAnswer = this.minPointsPerCorrectAnswer;
    this.activeWordIndex += 1;
    
    // update counts on wrong
    this.sprintCounts.rightInTheRow = 0;
    this.sprintCounts.pointsPerCorrectAnswer = this.minPointsPerCorrectAnswer;
    this.sprintCounts.dots = 0; // rightInTheRow % 4
    this.sprintCounts.birds = 1; // rightInTheRow / 4 + 1;
  }

  /**
   * Prepare array of length 'len' with random 0 or 1.
   */
  private chooseCorrect(len: number) {
    const correctIds = [];
    for (let i = 0; i < len; i += 1) {
      correctIds.push(Math.round(Math.random()));
    }
    return correctIds;
  }

  /**
   * Generates words with correct and incorrect flags and proposed translations
   * (correct translation for correct flags and random incorrect translation for incorrect flags).
   */
  private generateMixCorrectAndIncorrect() {
    // for every incorrect word we need to add proposed translation from any word excluding itself
    return this.words!.map((word: ShortWord, index) => {
      // this is correct word
      if (this.correctIndexes![index]) {
        const newWord = {
          ...word,
          correctFlag: 1,
          proposedTranslate: word.wordTranslate,
        };
        return newWord;
      }
      // this is incorrect word
      let randomIndex = Math.floor(Math.random() * this.words!.length);
      if (randomIndex === index) {
        randomIndex += 1 % this.words!.length;
      }
      const newWord = {
        ...word,
        correctFlag: 0,
        proposedTranslate: this.words![randomIndex].wordTranslate,
      };
      return newWord;
    });
  }

  private clear() {
    this.timer!.clear();
    this.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintGame;
