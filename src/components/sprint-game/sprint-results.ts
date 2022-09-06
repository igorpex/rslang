/* eslint-disable @typescript-eslint/no-unused-vars */
import Component from '../../utils/component';
import {
  GameResult, ShortWord, SprintCounts,
} from '../../interfaces';
import playButtonImg from '../../assets/svg/play-button.svg';

import './index.scss';
import {
  baseUrl,
} from '../../api/api';

import updateUserStatistics from '../shared/updateUserStatistics/updateUserStatistics';

class SprintResults extends Component {
  rightAnsweredWords: ShortWord[] | undefined;

  wrongAnsweredWords: ShortWord[] | undefined;

  sprintCounts: SprintCounts | undefined;

  next: string | undefined;

  refererType: string | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-results']);
  }

  public async start() {
    const answersContainer = new Component(this.element, 'div', ['sprint-results__container']);

    // the amount of right and wrong answers
    let rightCount = 0;
    let wrongCount = 0;
    if (this.rightAnsweredWords) {
      rightCount = this.rightAnsweredWords.length;
    }
    if (this.wrongAnsweredWords) {
      wrongCount = this.wrongAnsweredWords.length;
    }

    // right and wrong words
    const rightContainer = new Component(answersContainer.element, 'div', ['sprint-results__answers']);
    const rightContainerTitle = new Component(rightContainer.element, 'div', ['sprint-results__title'], `Правильно отвеченные слова: ${rightCount}`);
    this.rightAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(rightContainer.element, 'div', ['sprint-results-word-box']);
      const playAudioBtn = new Component(wordBox.element, 'img', ['sprint-results__card-audio-btn']);
      playAudioBtn.element.setAttribute('src', playButtonImg);
      const wordAudio = new Audio(`${baseUrl}/${word.audio}`);
      playAudioBtn.element.addEventListener('click', () => {
        wordAudio.play();
      });
      const wordEn = new Component(wordBox.element, 'div', ['sprint-results-word'], word.word);
      const dash = new Component(wordBox.element, 'div', ['sprint-results-dash'], '-');
      const wordRu = new Component(wordBox.element, 'div', ['sprint-results-translate'], word.wordTranslate);
    });

    const wrongContainer = new Component(answersContainer.element, 'div', ['sprint-results__answers']);
    const wrongContainerTitle = new Component(wrongContainer.element, 'div', ['sprint-results__title'], `Неправильно отвеченные слова: ${wrongCount}`);
    this.wrongAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(wrongContainer.element, 'div', ['sprint-results-word-box']);
      const playAudioBtn = new Component(wordBox.element, 'img', ['sprint-results__card-audio-btn']);
      playAudioBtn.element.setAttribute('src', playButtonImg);
      const wordAudio = new Audio(`${baseUrl}/${word.audio}`);
      playAudioBtn.element.addEventListener('click', () => {
        wordAudio.play();
      });
      const wordEn = new Component(wordBox.element, 'div', ['sprint-results-word'], word.word);
      const dash = new Component(wordBox.element, 'div', ['sprint-results-dash'], '-');
      const wordRu = new Component(wordBox.element, 'div', ['sprint-results-translate'], word.wordTranslate);
    });

    // buttons for replay or returning to game page
    const buttonsContainer = new Component(this.element, 'div', ['sprint-results__buttons-container']);
    const buttonsAgain = new Component(buttonsContainer.element, 'a', ['sprint-results__button'], 'ИГРАТЬ ЕЩЕ');
    buttonsAgain.element.setAttribute('href', '#/games/sprint');
    buttonsAgain.element.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.reload();
    });
    console.log('this.refererType:', this.refererType);
    if (this.refererType === 'ebook') {
      const buttonsListGames = new Component(buttonsContainer.element, 'a', ['sprint-results__button'], 'К СЛОВАРЮ');
      buttonsListGames.element.setAttribute('href', '#');
      buttonsListGames.element.addEventListener('click', (e) => {
        e.preventDefault();
        const loc = window.location;
        loc.hash = `/${this.refererType}`;
        const url = new URL(loc.href);
        window.location.replace(url);
      });
    } else {
      const buttonsListGames = new Component(buttonsContainer.element, 'a', ['sprint-results__button'], 'К СПИСКУ ИГР');
      buttonsListGames.element.setAttribute('href', '#/games');
    }

    const gameResult: GameResult = {
      right: rightCount,
      wrong: wrongCount,
      maxRightInARow: this.sprintCounts!.maxRightInTheRow,
    };
    await updateUserStatistics('sprint', gameResult);
  }
}
export default SprintResults;
