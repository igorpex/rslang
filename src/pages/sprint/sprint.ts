import Component from '../../utils/component';
// import SprintContainer from '../../components/sprint-game/sprint-container';
import SprintEntrance from '../../components/sprint-game/sprint-entrance';
import SprintGame from '../../components/sprint-game/sprint-game';
import SprintPrepare from '../../components/sprint-game/sprint-prepare';
import Auth from '../../components/auth/auth/auth';
import {
  getUserAggregatedWords, getUserAggregatedWordsWithoutGroup, getUserWords, getWords,
} from '../../api/api';
import {
  ShortWord, SprintCounts, Word, WordPromise,
} from '../../interfaces';
import SprintResults from '../../components/sprint-game/sprint-results';
import { authStorageKey } from '../../utils/config';
import getUserWordsToNPages from '../../api/api-related-services';

class Sprint extends Component {
  // private sprintContainer: SprintContainer;
  private sprintEntrance: SprintEntrance;

  private sprintPrepare: SprintPrepare | undefined;

  private sprintGame: SprintGame | undefined;

  private auth: boolean | undefined;

  private sprintResults: SprintResults | undefined;

  private rightAnsweredWords: ShortWord[] | undefined;

  private wrongAnsweredWords: ShortWord[] | undefined;

  private sprintCounts: SprintCounts | undefined;

  private refererType: string | undefined;

  private next: string | undefined;

  filter = {
    hard: { 'userWord.difficulty': 'hard' },
    all: {
      $or: [{ 'userWord.difficulty': 'hard' }, { userWord: null }, { 'userWord.difficulty': 'easy' },
        { 'userWord.difficulty': 'normal' }],
    },
    easy: { 'userWord.difficulty': 'easy' },
    withoutEasy: {
      $or: [{ 'userWord.difficulty': 'hard' }, { userWord: null },
        { 'userWord.difficulty': 'normal' }],
    },
  };

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
    this.sprintGame.start(this.finishGame.bind(this));

    // this.sprintGame.start(userId, wordsList, this.finishGame.bind(this));
  }

  private async getWords() {
    this.refererType = this.sprintEntrance.refererType!;
    this.next = this.sprintEntrance.refererType!;
    console.log('Работает функция getWords');
    console.log('Sprint this.refererType:', this.refererType);
    console.log('Sprint this.auth:', this.auth);

    if (this.refererType === 'ebook' && this.auth) {
      return this.getAuthWordsByGroupAndPage();
    }
    if (this.refererType === 'ebook' && !this.auth) {
      return this.getNoAuthWordsByGroupAndPage();
    }
    return this.getWordsByDifficulty();
  }

  private async getAuthWordsByGroupAndPage() {
    console.log('Работает функция getAuthWordsByGroupAndPage');
    const userData = localStorage.getItem('userData');
    const { group, page } = JSON.parse(userData!);
    const userAuthData = localStorage.getItem(authStorageKey);
    const { userId, token } = JSON.parse(userAuthData!);
    let words;
    if (group === 6) {
      const wordsPerPage = 3600;
      const filter = this.filter.hard;
      const data = await getUserAggregatedWordsWithoutGroup({
        id: userId, group, page, wordsPerPage, filter, token,
      });
      // getUserAllAggregatedWords
      words = data[0].paginatedResults.map((elem: Word) => {
        const newElem = JSON.parse(JSON.stringify(elem));
        // eslint-disable-next-line no-underscore-dangle
        newElem.id = elem._id;
        return newElem;
      });
    } else {
      const unfilteredWords = await getUserWordsToNPages();
      words = unfilteredWords
        .filter((word) => (!word.userWord || word.userWord.difficulty !== 'easy'));
    }
    console.log('getAuthWordsByGroupAndPage words:', words);
    return words;
  }

  private async getWordsByDifficulty() {
    console.log('Работает функция getWordsByDifficulty');
    const group = this.sprintEntrance.difficulty!;
    // this.refererType = this.sprintEntrance.refererType!;
    // this.next = this.sprintEntrance.refererType!;
    // get 10 random not repeated pages
    const pagesAllArr = Array.from(Array(30), (x, i) => i);
    const randomPagesArr = this.shuffle(pagesAllArr).slice(0, 10);
    // console.log('randomPagesArr:', randomPagesArr);
    // const words = [];
    const wordsPagesPromises = randomPagesArr.map((pageNum) => getWords({ group, page: pageNum }));
    const wordsPages = (await Promise.allSettled(wordsPagesPromises));
    const filteredPages = wordsPages
      .filter(({ status }) => status === 'fulfilled')
      // eslint-disable-next-line max-len
      .map((fulfilledPromise) => (fulfilledPromise as unknown as PromiseFulfilledResult<WordPromise>).value)
      .map((page) => page.items)
      .flat()
      .map((word) => ({
        audio: word.audio,
        id: word.id,
        word: word.word,
        wordTranslate: word.wordTranslate,
        group: word.group,
        page: word.page,
      }));
    return filteredPages;
  }

  private async getNoAuthWordsByGroupAndPage() {
    console.log('Работает функция getNoAuthWordsByGroupAndPage');
    const userData = localStorage.getItem('userData');
    const { group, page } = JSON.parse(userData!);

    // get pages from current to 0; so user starts from current and if it is not enough, get next;
    const pagesArr = Array.from(Array(page + 1).keys()).reverse().slice(0, 10);
    console.log('pagesArr', pagesArr);
    // const pagesAllArr = Array.from(Array(30), (x, i) => i);
    const wordsPagesPromises = pagesArr.map((pageNum) => getWords({ group, page: pageNum }));
    const wordsPages = (await Promise.allSettled(wordsPagesPromises));
    const filteredPages = wordsPages
      .filter(({ status }) => status === 'fulfilled')
      .map(
        // eslint-disable-next-line max-len
        (fulfilledPromise) => (fulfilledPromise as unknown as PromiseFulfilledResult<WordPromise>).value,
      )
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .map((page) => page.items)
      .flat()
      .map((word) => ({
        audio: word.audio,
        id: word.id,
        word: word.word,
        wordTranslate: word.wordTranslate,
        group: word.group,
        page: word.page,
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

  public finishGame() {
    // console.log('game finished');
    // this.rightAnsweredWords = this.sprintGame!.rightAnsweredWords;
    // this.wrongAnsweredWords = this.sprintGame!.wrongAnsweredWords;
    // this.sprintCounts = this.sprintGame!.sprintCounts;
    this.sprintGame?.destroy();

    this.sprintResults = new SprintResults(this.element);
    if (this.sprintGame !== undefined) {
      this.sprintGame.volume = false;
    }
    // Prepare results
    this.sprintResults.rightAnsweredWords = this.sprintGame!.rightAnsweredWords;
    this.sprintResults.wrongAnsweredWords = this.sprintGame!.wrongAnsweredWords;
    this.sprintResults.sprintCounts = this.sprintGame!.sprintCounts;
    // this.sprintResults.start(this.closeGame.bind(this));
    this.sprintResults.next = this.next;
    this.sprintResults.refererType = this.refererType;
    this.sprintResults.start();
  }

  private prepareToPlay() {

  }
}

export default Sprint;
