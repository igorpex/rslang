import Component from '../../utils/component';
// import SprintContainer from '../../components/sprint-game/sprint-container';
import SprintEntrance from '../../components/sprint-game/sprint-entrance';
import SprintGame from '../../components/sprint-game/sprint-game';
import SprintPrepare from '../../components/sprint-game/sprint-prepare';
import Auth from '../../components/auth/auth/auth';
import { getWords } from '../../api/api';
import { WordPromise } from '../../interfaces';

class Sprint extends Component {
  // private sprintContainer: SprintContainer;
  private sprintEntrance: SprintEntrance;

  private sprintPrepare: SprintPrepare | undefined;

  private sprintGame: SprintGame | undefined;

  private auth: boolean | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint']);
    // this.sprintContainer = new SprintContainer(this.element);
    this.sprintEntrance = new SprintEntrance(this.element);
    this.sprintEntrance.chooseDifficulty(this.prepareGame.bind(this));
    // this.sprintEntrance.element.addEventListener('click', () => this.prepareGame());
  }

  private prepareGame() {
    console.log('game preparing');
    this.sprintEntrance.destroy();
    this.sprintPrepare = new SprintPrepare(this.element);
    this.sprintPrepare.prepare(this.startGame.bind(this));
  }

  public async startGame() {
    const auth = new Auth();
    this.auth = !auth.JwtHasExpired();
    const words = await this.getWords();
    this.sprintPrepare!.destroy();
    console.log('game started');
    this.sprintGame = new SprintGame(this.element);

    // Prepare game parameters
    this.sprintGame.words = words;
    this.sprintGame.auth = this.auth;
    this.sprintGame.start();

    // this.sprintGame.start(userId, wordsList, this.finishGame.bind(this));
  }

  private async getWords() {
    if (this.auth) {
      return this.getWordsByDifficulty();
    }
    return this.getWordsByDifficulty();
    // return this.getUserWordsByGroupPage();
    // return this.getWordsByDifficulty();
    // id, group, page, wordsPerPage, filter, token
    // getUserAggregatedWords();
  }

  private async getWordsByDifficulty() {
    const group = this.sprintEntrance.difficulty!;
    // get 10 random not repeated pages
    const pagesAllArr = Array.from(Array(20), (x, i) => i);
    const randomPagesArr = this.shuffle(pagesAllArr).slice(0, 10);
    console.log('randomPagesArr:', randomPagesArr);
    // const words = [];
    const wordsPagesPromises = randomPagesArr.map((pageNum) => getWords({ group, page: pageNum }));
    const wordsPages = (await Promise.allSettled(wordsPagesPromises));
    const filteredPages = wordsPages
      .filter(({ status }) => status === 'fulfilled')
      .map((fulfilledPromise) => (fulfilledPromise as unknown as PromiseFulfilledResult<WordPromise>).value)
      .map((page) => page.items)
      .flat()
      .map((word) => ({
        audio: word.audio, id: word.id, word: word.word, wordTranslate: word.wordTranslate, group: word.group, page: word.page,
      }));
    return filteredPages;
  }

  private shuffle(array: Array<number>) {
    let currentIndex = array.length; let
      randomIndex;

    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // eslint-disable-next-line no-param-reassign
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  private getUserWordsByGroupPage() {

  }
  // public finishGame() {
  //   this.sprintPrepare!.destroy();
  //   console.log('game started');
  //   this.sprintGame = new SprintGame(this.element);
  //   this.sprintGame.start(userId, wordsList, callback);
  // }

  private prepareToPlay() {

  }
}

export default Sprint;
