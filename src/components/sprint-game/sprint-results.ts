import Component from '../../utils/component';
import { ShortWord, SprintCounts } from '../../interfaces';
import playBtn from '../../assets/svg/play.svg';

import './index.scss';
import { baseUrl } from '../../api/api';

class SprintResults extends Component {
  rightAnsweredWords: ShortWord[] | undefined;

  wrongAnsweredWords: ShortWord[] | undefined;

  sprintCounts: SprintCounts | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-results']);
  }

  public start() {
    const answersContainer = new Component(this.element, 'div', ['sprint-results__container']);

    // the amount of right and wrong answers
    let rightCount = 0;
    let wrongCount = 0;
    if (this.rightAnsweredWords) { rightCount = this.rightAnsweredWords.length }
    if (this.wrongAnsweredWords) { wrongCount = this.wrongAnsweredWords.length }

    // right and wrong words
    const rightContainer = new Component(answersContainer.element, 'div', ['sprint-results__answers']);
    const rightContainerTitle = new Component(rightContainer.element, 'div', ['sprint-results__title'], 'Правильно отвеченные слова: ' + rightCount);
    this.rightAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(rightContainer.element, 'div', ['sprint__results-word-box']);
      const playAudioBtn = new Component(wordBox.element, 'img', ['sprint__results__card-audio-btn']);
      playAudioBtn.element.setAttribute('src', playBtn);
      const wordAudio = new Audio(`${baseUrl}/${word.audio}`);
      playAudioBtn.element.addEventListener('click', () => {
        wordAudio.play();
      });
      const wordEn = new Component(wordBox.element, 'div', ['sprint__results-word'], word.word);
      const dash = new Component(wordBox.element, 'div', ['sprint__results-dash'], '-');
      const wordRu = new Component(wordBox.element, 'div', ['sprint__results-translate'], word.wordTranslate);
    });

    const wrongContainer = new Component(answersContainer.element, 'div', ['sprint-results__answers']);
    const wrongContainerTitle = new Component(wrongContainer.element, 'div', ['sprint-results__title'], 'Неправильно отвеченные слова: ' + wrongCount);
    this.wrongAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(wrongContainer.element, 'div', ['sprint__results-word-box']);
      const playAudioBtn = new Component(wordBox.element, 'img', ['sprint__results__card-audio-btn']);
      playAudioBtn.element.setAttribute('src', playBtn);
      const wordAudio = new Audio(`${baseUrl}/${word.audio}`);
      playAudioBtn.element.addEventListener('click', () => {
        wordAudio.play();
      });
      const wordEn = new Component(wordBox.element, 'div', ['sprint__results-word'], word.word);
      const dash = new Component(wordBox.element, 'div', ['sprint__results-dash'], '-');
      const wordRu = new Component(wordBox.element, 'div', ['sprint__results-translate'], word.wordTranslate);
    });

    // buttons for replay or returning to game page
    const buttonsContainer = new Component(this.element, 'div', ['sprint-results__buttons-container']);
    const buttonsAgain = new Component(buttonsContainer.element, 'a', ['sprint-results__button'], 'ИГРАТЬ ЕЩЕ');
    buttonsAgain.element.setAttribute('href', '#/games/sprint');
    const buttonsListGames = new Component(buttonsContainer.element, 'a', ['sprint-results__button'], 'К СПИСКУ ИГР');
    buttonsListGames.element.setAttribute('href', '#/games');
  }
}
export default SprintResults;
