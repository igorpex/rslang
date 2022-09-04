/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { StatisticsObject } from '../../interfaces';
import Component from '../../utils/component';
import audioIcon from '../../assets/svg/audio-speaker.svg';
import UIButton from '../UI/button/button';
import { baseUrl } from '../../api/api';

class Result extends Component {
  trueList: Component;

  trueTitle: Component;

  falseTitle: Component;

  result: StatisticsObject[];

  falseList: Component;

  buttonsContainer: Component;

  audio: HTMLAudioElement;

  constructor(parentNode: HTMLElement, result: StatisticsObject[]) {
    super(parentNode, 'div', ['audioChallenge-result__container']);
    this.result = result;

    this.audio = new Audio();

    const resultContent = new Component(this.element, 'div', ['audioChallenge-result__content']);
    const resultTitle = new Component(resultContent.element, 'h2', ['audioChallenge-content__title']);
    resultTitle.element.innerHTML = 'Отличный результат!';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const trueBlock = new Component(resultContent.element, 'div', ['audioChallenge-true__block']);
    this.trueTitle = new Component(trueBlock.element, 'p', ['true-title'], 'Правильныx ответов:');
    this.trueList = new Component(trueBlock.element, 'ul', ['true-list']);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const falseBlock = new Component(resultContent.element, 'div', ['audioChallenge-false__block']);
    this.falseTitle = new Component(falseBlock.element, 'p', ['false-title'], 'Неправильных ответов:');
    this.falseList = new Component(falseBlock.element, 'ul', ['false-list']);

    this.buttonsContainer = new Component(this.element, 'div', ['audioChallenge-result__buttons']);
    const repeatButton = new Component(this.buttonsContainer.element, 'a', ['audioChallenge-repeat__button'], 'Играть еще');
    repeatButton.element.setAttribute('href', '#/games/audioChallenge');
    repeatButton.element.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.reload();
    });

    this.checkPreviousPage();

    this.filterTrueAnswers();
    this.filterFalseAnswers();
  }

  checkPreviousPage() {
    const params = new URLSearchParams(document.location.search);
    const ref = params.get('ref');
    if (ref !== null) {
      if (ref!.includes('ebook')) {
        const buttonsListGames = new Component(this.buttonsContainer.element, 'a', ['audioChallenge-return__button'], 'К СЛОВАРЮ');
        buttonsListGames.element.setAttribute('href', '#');
        buttonsListGames.element.addEventListener('click', (e) => {
          e.preventDefault();
          let next = '';
          if (ref) {
            next = ref.slice(1);
          }
          const loc = window.location;
          loc.hash = next;
          const url = new URL(loc.href);
          url.searchParams.delete('ref');
          window.location.replace(url);
        });
      }
    } else {
      const buttonsListGames = new Component(this.buttonsContainer.element, 'a', ['audioChallenge-return__button'], 'К СПИСКУ ИГР');
      buttonsListGames.element.setAttribute('href', '#/games');
    }
  }

  filterTrueAnswers() {
    const trueAnswers = this.result.filter((item: StatisticsObject) => item.isAnswerTrue === true);
    // eslint-disable-next-line no-restricted-syntax
    for (const words in trueAnswers) {
      const listItem = new Component(this.trueList.element, 'li', ['result-list__item']);
      const itemAudio = new UIButton(listItem.element, ['list__item-audio'], '');
      itemAudio.onClickButton = () => {
        this.audio.src = `${baseUrl}/${trueAnswers[words].word.audio}`;
        this.audio.play();
      };
      itemAudio.element.style.backgroundImage = `url(${audioIcon})`;
      const itemWord = new Component(listItem.element, 'span', ['list__item-word']);
      itemWord.element.innerHTML = `${trueAnswers[words].word.word} - <i>${trueAnswers[words].word.wordTranslate}<i>`;
    }
    this.trueTitle.element.innerHTML = `Правильных ответов: ${trueAnswers.length}`;
  }

  filterFalseAnswers() {
    // eslint-disable-next-line max-len
    const falseAnswers = this.result.filter((item: StatisticsObject) => item.isAnswerTrue === false);
    for (const words in falseAnswers) {
      const listItem = new Component(this.falseList.element, 'li', ['result-list__item']);
      const itemAudio = new UIButton(listItem.element, ['list__item-audio'], '');
      itemAudio.element.style.backgroundImage = `url(${audioIcon})`;
      itemAudio.onClickButton = () => {
        this.audio.src = `${baseUrl}/${falseAnswers[words].word.audio}`;
        this.audio.play();
      };
      const itemWord = new Component(listItem.element, 'span', ['list__item-word']);
      itemWord.element.innerHTML = `${falseAnswers[words].word.word} - <i>${falseAnswers[words].word.wordTranslate}<i>`;
    }
    this.falseTitle.element.innerHTML = `Неравильных ответов: ${falseAnswers.length}`;
  }

  clear() {
    this.element.innerHTML = ' ';
  }
}

export default Result;
