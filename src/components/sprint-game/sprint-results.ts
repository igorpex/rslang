import Component from '../../utils/component';
import './index.scss';
import { ShortWord, SprintCounts } from '../../interfaces';
import Auth from '../auth/auth/auth';
import { baseUrl } from '../../api/api';
import playBtn from '../../assets/svg/play.svg';

class SprintResults extends Component {
  rightAnsweredWords: ShortWord[] | undefined;

  wrongAnsweredWords: ShortWord[] | undefined;

  sprintCounts: SprintCounts | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-results']);
  }

  public start() {
    const rightContainer = new Component(this.element, 'div', ['sprint-results__answers']);
    const rightContainerTitle = new Component(null, 'div', ['sprint-results__title'], 'Правильно отвеченные слова');
    rightContainer.element.append(rightContainerTitle.element);
    this.rightAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(rightContainer.element, 'div', ['sprint__results-word-box']);
      const wordAudio = new Audio(`${baseUrl}/${word.audio}`);
      const playAudioBtn = new Component(wordBox.element, 'img', ['sprint__card-audio-btn', 'sprint__results-audio']);
      playAudioBtn.element.setAttribute('src', playBtn);
      playAudioBtn.element.addEventListener('click', () => wordAudio.play());
      const wordEn = new Component(wordBox.element, 'div', ['sprint__results-word'], word.word);
      const wordRu = new Component(wordBox.element, 'div', ['sprint__results-translate'], word.wordTranslate);
    });

    const wrongContainer = new Component(this.element, 'div', ['sprint-results__answers']);
    const wrongContainerTitle = new Component(wrongContainer.element, 'div', ['sprint-results__title'], 'Неправильно отвеченные слова');
    this.wrongAnsweredWords!.forEach((word: ShortWord) => {
      const wordBox = new Component(wrongContainer.element, 'div', ['sprint__results-word-box']);
      const wordAudio = new Component(wordBox.element, 'audio', ['sprint__results-audio'], word.audio);
      const wordEn = new Component(wordBox.element, 'div', ['sprint__results-word'], word.word);
      const wordRu = new Component(wordBox.element, 'div', ['sprint__results-translate'], word.wordTranslate);
    });

    this.saveStatistics();
  }

  async saveStatistics() {
    const sprintResults = {
      maxRightInTheRow: this.sprintCounts?.maxRightInTheRow,
      rightAnswers: this.rightAnsweredWords?.length,
      wrongAnswers: this.wrongAnsweredWords?.length,
      date: new Date(),
    };
    console.log('sprintResults:', sprintResults);
  }
}
export default SprintResults;
