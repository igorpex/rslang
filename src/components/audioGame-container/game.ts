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
    const gameContent = new Component(this.element, 'div', ['game__content']);

    const audioButton = new UIButton(gameContent.element, ['game__audio-button'], '');
    audioButton.element.style.backgroundImage = `url(${audioIcon})`;
    const audioTranslate = new Component(gameContent.element, 'p', ['game__translate'], `${gameObj.word!.word}`);
    audioTranslate.element.style.opacity = '0';
    const answersButton = new Component(gameContent.element, 'div', ['game__answers']);
    const { answers } = this.gameObj;
    this.buttons = [];

    this.playAudio();

    answers.forEach((answer, i) => {
      const button = new UIButton(answersButton.element, ['answer__btn'], `${i + 1}. ${answer.wordTranslate}`);
      button.element.setAttribute('data-word', answer.wordTranslate);

      this.buttons.push(button);
      button.onClickButton = () => {
        audioTranslate.element.style.opacity = '1';
        if (this.gameObj.word!.wordTranslate === answer.wordTranslate) {
          button.element.style.background = 'rgba(0, 128, 0, 0.476)';
          this.staticsObject = {
            word: this.gameObj.word!,
            isAnswerTrue: true,
          };
          console.log(this.gameObj);
          updateWordStatistics('audioChallenge', 'right', this.gameObj.word!);
        } else {
          button.element.style.background = 'rgba(255, 0, 0, 0.493)';
          this.staticsObject = {
            word: this.gameObj.word!,
            isAnswerTrue: false,
          };
          this.findTrueAnswer();
          console.log(this.gameObj);
          updateWordStatistics('audioChallenge', 'wrong', this.gameObj.word!);
        }
        this.buttons.forEach((btn) => {
          btn.setDisabled(true);
        });
        this.helpBtn.element.style.display = 'none';
        this.nextBtn.element.style.display = 'block';
      };
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
      audioTranslate.element.style.opacity = '1';
      this.findTrueAnswer();

      updateWordStatistics('audioChallenge', 'wrong', this.gameObj.word!);
      this.buttons.forEach((button) => {
        button.setDisabled(true);
      });
      this.helpBtn.element.style.display = 'none';
      this.nextBtn.element.style.display = 'block';
    };
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
