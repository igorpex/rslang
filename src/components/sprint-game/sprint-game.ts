import Component from '../../utils/component';

import './index.scss';
import { ShortWord, SprintWord } from '../../interfaces';

class SprintGame extends Component {
  private content:Component;

  public words: ShortWord[] | undefined;

  auth: boolean | undefined;

  private correctIndexes: number[] | undefined;

  private sprintWords: SprintWord[] | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-game']);

    this.content = new Component(this.element, 'div', ['sprint-game__content']);

    this.content.element.innerHTML = `
    <h1>Это уже началась игра</h1>
    <p>Список слов</p>
    `;
  }

  public start() {
    // console.log('Words to play:', this.words);
    const len = this.words!.length;
    this.correctIndexes = this.chooseCorrect(len);
    this.sprintWords = this.generateMixCorrectAndIncorrect();
    console.log('Final words to play:', this.sprintWords);
    this.sprintWords!.forEach((word: SprintWord) => {
      const comp = new Component(this.content.element, 'div', ['sprint-word'], `Слово: ${word.word}, предлагаемый перевод: ${word.proposedTranslate}, правильный?: ${word.correctFlag}`);
    });
  }

  private chooseCorrect(len: number) {
    const correctIds = [];
    for (let i = 0; i < len; i += 1) {
      correctIds.push(Math.round(Math.random()));
    }
    return correctIds;
  }

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
    this.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default SprintGame;
