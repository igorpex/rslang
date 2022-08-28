import Component from '../../utils/component';
import './index.scss';
import { ShortWord, SprintCounts } from '../../interfaces';

class SprintResults extends Component {
  rightAnsweredWords: ShortWord[] | undefined;

  wrongAnsweredWords: ShortWord[] | undefined;

  sprintCounts: SprintCounts | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-results']);
  }

  public start() {
    const rightContainer = new Component(this.element, 'div', ['sprint-results__answers']);
    const rightContainerTitle = new Component(rightContainer.element, 'div', ['sprint-results__title'], 'Правильно отвеченные слова');
    this.rightAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(rightContainer.element, 'div', ['sprint__results-word-box']);
      const wordEn = new Component(wordBox.element, 'div', ['sprint__results-word'], word.word);
      const wordRu = new Component(wordBox.element, 'div', ['sprint__results-translate'], word.wordTranslate);
    });

    const wrongContainer = new Component(this.element, 'div', ['sprint-results__answers']);
    const wrongContainerTitle = new Component(wrongContainer.element, 'div', ['sprint-results__title'], 'Неправильно отвеченные слова');
    this.wrongAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(wrongContainer.element, 'div', ['sprint__results-word-box']);
      const wordEn = new Component(wordBox.element, 'div', ['sprint__results-word'], word.word);
      const wordRu = new Component(wordBox.element, 'div', ['sprint__results-translate'], word.wordTranslate);
    });
  }
}
export default SprintResults;
