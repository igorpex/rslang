import { baseUrl } from '../../api/api';
import { GameObj, StatisticsObject } from '../../interfaces';
import Component from '../../utils/component';
import UIButton from '../UI/button/button';
import audioIcon from '../../assets/svg/audio-icon.svg';
import updateWordStatistics from '../shared/updateUserWord/updateUserWord';

class Game extends Component {
  gameObj: GameObj;

  nextBtn: UIButton;

  helpBtn: UIButton;

  buttons: UIButton[];

  staticsObject: StatisticsObject;

  audioTranslate: Component;

  volume: boolean;

  constructor(parentNode: HTMLElement, gameObj: GameObj) {
    super(parentNode, 'div', ['game']);
    this.gameObj = gameObj;
    this.staticsObject = {
      word: this.gameObj.word!,
      isAnswerTrue: false,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const gameTitle = new Component(
      this.element,
      'div',
      ['game__title'],
      'Выберите правильный ответ',
    );
    this.volume = true;
    const gameContent = new Component(this.element, 'div', ['game__content']);

    const audioButton = new UIButton(gameContent.element, ['game__audio-button'], '');
    audioButton.element.style.backgroundImage = `url(${audioIcon})`;
    this.audioTranslate = new Component(gameContent.element, 'p', ['game__translate'], `${gameObj.word!.word}`);
    this.audioTranslate.element.style.opacity = '0';
    const answersButton = new Component(gameContent.element, 'div', ['game__answers']);
    const { answers } = this.gameObj;
    this.buttons = [];

    this.playAudio();

    answers.forEach((answer, i) => {
      const button = new UIButton(answersButton.element, ['answer__btn'], `${i + 1}. ${answer.wordTranslate}`);
      button.element.setAttribute('data-word', answer.wordTranslate);
      button.element.setAttribute('data-num', i.toString());

      this.buttons.push(button);
      button.onClickButton = () => {
        this.audioTranslate.element.style.opacity = '1';
        this.checkRightAnswers(button.element, answer.wordTranslate);
      };
    });

    document.addEventListener('keydown', (e) => {
      if (this.volume === true) {
        switch (e.code) {
          case 'Numpad7':
            e.preventDefault();
            this.playAudio();
            break;
          case 'Digit7':
            e.preventDefault();
            this.playAudio();
            break;
          case 'ShiftLeft':
            e.preventDefault();
            this.finishThisRound();
            break;
          case 'ShiftRight':
            e.preventDefault();
            this.finishThisRound();
            break;
          case 'Numpad0':
            this.audioTranslate.element.style.opacity = '1';
            break;
          case 'Digit0':
            this.audioTranslate.element.style.opacity = '1';
            break;
          case 'Numpad1':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '0') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Digit1':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '0') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Numpad2':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '1') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Digit2':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '1') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Numpad3':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '2') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Digit3':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '2') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Numpad4':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '3') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Digit4':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '3') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Numpad5':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '4') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          case 'Digit5':
            e.preventDefault();
            this.buttons.forEach((btn) => {
              if (btn.element.getAttribute('data-num') === '4') {
                this.checkRightAnswers(btn.element, btn.element.getAttribute('data-word')!);
              }
            });
            break;
          default:
            break;
        }
      }
    });
    this.helpBtn = new UIButton(gameContent.element, ['help__game-btn'], '');
    this.helpBtn.element.innerHTML = 'Не знаю';

    this.nextBtn = new UIButton(gameContent.element, ['next__game-btn'], '');
    this.nextBtn.element.style.display = 'none';
    this.nextBtn.element.innerHTML = 'Далее';

    audioButton.onClickButton = () => {
      this.playAudio();
    };
    this.helpBtn.onClickButton = () => {
      this.finishThisRound();
    };
  }

  checkRightAnswers(button: HTMLElement, answer: string) {
    this.audioTranslate.element.style.opacity = '1';
    const btn = button;
    if (this.gameObj.word!.wordTranslate === answer) {
      btn.style.background = 'rgba(0, 128, 0, 0.476)';
      this.staticsObject = {
        word: this.gameObj.word!,
        isAnswerTrue: true,
      };
      updateWordStatistics('audioChallenge', 'right', this.gameObj.word!);
    } else {
      btn.style.background = 'rgba(255, 0, 0, 0.493)';
      this.staticsObject = {
        word: this.gameObj.word!,
        isAnswerTrue: false,
      };
      this.findTrueAnswer();
      updateWordStatistics('audioChallenge', 'wrong', this.gameObj.word!);
    }
    this.buttons.forEach((item) => {
      item.setDisabled(true);
    });
    this.helpBtn.element.style.display = 'none';
    this.nextBtn.element.style.display = 'block';
  }

  finishThisRound() {
    this.audioTranslate.element.style.opacity = '1';
    this.findTrueAnswer();

    updateWordStatistics('audioChallenge', 'wrong', this.gameObj.word!);
    this.buttons.forEach((button) => {
      button.setDisabled(true);
    });
    this.helpBtn.element.style.display = 'none';
    this.nextBtn.element.style.display = 'block';
  }

  playAudio() {
    const audio = new Audio();
    audio.src = `${baseUrl}/${this.gameObj.word!.audio}`;
    audio.play();
  }

  findTrueAnswer() {
    this.buttons.forEach((btn) => {
      if (btn.element.getAttribute('data-word') === this.gameObj.word!.wordTranslate) {
        // eslint-disable-next-line no-param-reassign
        btn.element.style.background = 'rgba(0, 128, 0, 0.476)';
      }
    });
  }
}

export default Game;
