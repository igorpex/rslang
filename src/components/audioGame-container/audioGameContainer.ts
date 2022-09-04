import { getUserAggregatedWords, getWords } from '../../api/api';
import {
  GameObj, IDataObj, StatisticsObject, Word,
} from '../../interfaces';
import Component from '../../utils/component';
import ListItem from '../shared/list/list';
import UIButton from '../UI/button/button';
import './audioGame.scss';
import Game from './game';
import Result from './result';
import arrowButton from '../../assets/svg/down-arrow.svg';
import levelsIcon from '../../assets/svg/levels-icon.svg';
import Auth from '../auth/auth/auth';
import { authStorageKey } from '../../utils/config';

class AudioGameContainer extends Component {
  updateGroup: (group: number) => void = () => {};

  private title: Component;

  private content: Component;

  select: Component;

  levelTitle: Component;

  selectTitle: Component;

  game: Game | null;

  private group = 1;

  private page = 0;

  private randomPage = 0;

  arrayOfPage: number[];

  gameObject: GameObj;

  count = 0;

  words: Word[];

  allAnswers: Word[];

  arrayOfName: string[];

  refererType: String;

  isAuth: boolean;

  authorization: Auth;

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

  staticsObjects: StatisticsObject[];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['audioChallange__container']);

    this.words = [];
    this.arrayOfPage = [];
    this.allAnswers = [];
    this.gameObject = {
      word: null,
      answers: [],
    };
    this.staticsObjects = [];
    this.arrayOfName = ['Новичок', 'Ученик', 'Мыслитель', 'Кандидат', 'Мастер', 'Эксперт'];

    this.refererType = 'menu';

    this.isAuth = false;
    this.authorization = new Auth();
    this.checkAuthorization();

    this.game = null;

    this.content = new Component(this.element, 'div', ['audioChallenge__content']);
    this.title = new Component(this.content.element, 'h2', ['audioChallenge__title'], 'Аудиовызов');
    const description = new Component(this.content.element, 'p', ['content__list']);
    description.element.innerHTML = '«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.';
    const list = new Component(this.content.element, 'ul', ['description__list']);
    const pointOne = new Component(list.element, 'li', ['audioChallenge-list__item']);
    pointOne.element.innerHTML = 'Используйте мышь, чтобы выбрать.';
    const pointTwo = new Component(list.element, 'li', ['audioChallenge-list__item']);
    pointTwo.element.innerHTML = 'Используйте цифровые клавиши от 1 до 5 для выбора ответа.';
    const pointThree = new Component(list.element, 'li', ['audioChallenge-list__item']);
    pointThree.element.innerHTML = 'Используйте Enter для перехода к следующему слову.';
    const pointFour = new Component(list.element, 'li', ['audioChallenge-list__item']);
    pointFour.element.innerHTML = 'Используйте клавишу 0 для подсказки.';
    const pointFive = new Component(list.element, 'li', ['audioChallenge-list__item']);
    pointFive.element.innerHTML = 'Используйте Shift для повтроного звучания слова.';

    const options = new Component(this.content.element, 'div', ['audioChallenge__options']);
    const selectBlock = new Component(options.element, 'div', ['options__select-block']);
    this.selectTitle = new Component(selectBlock.element, 'p', ['options__select-title']);
    this.selectTitle.element.innerHTML = 'Выберите сложность:';

    // level-list
    this.select = new Component(selectBlock.element, 'div', ['audioChallenge__level']);
    this.checkRefererType();
    const levelHeader = new Component(this.select.element, 'div', ['audioChallenge-level__header']);
    const levelIcon = new Component(levelHeader.element, 'span', ['audioChallenge-level__icon']);
    levelIcon.element.style.backgroundImage = `url(${levelsIcon})`;
    this.levelTitle = new Component(levelHeader.element, 'div', ['audioChallenge-level__title']);
    const levelBtn = new Component(levelHeader.element, 'span', ['audioChallenge-level__btn']);
    levelBtn.element.style.backgroundImage = `url(${arrowButton})`;

    const levelList = new Component(this.select.element, 'ul', ['audioChallenge-level__list']);
    for (let i = 0; i < this.arrayOfName.length; i += 1) {
      const listItem = new ListItem(levelList.element, i, this.arrayOfName[i]);
      if (this.group === i) {
        this.levelTitle.element.innerHTML = listItem.element.innerHTML;
      }
      listItem.onClickButton = (e) => {
        const target = e.target as HTMLElement;
        this.group = Number(target.getAttribute('data-group'));
        this.redrawPage(target);
      };
      listItem.element.setAttribute('data-group', `${i}`);
    }

    this.select.element.addEventListener('click', () => {
      levelList.element.classList.toggle('open');
    });

    const startButton = new UIButton(options.element, ['options__start-button'], 'Начать');

    startButton.onClickButton = () => {
      this.createGame();
    };

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        e.preventDefault();
        if (this.words.length >= 18) {
          this.staticsObjects.push(this.game!.staticsObject);
          this.startGame();
        } else {
          this.staticsObjects.push(this.game!.staticsObject);
          this.showResult(this.staticsObjects);
        }
      }
    });
  }

  async checkAuthorization() {
    this.isAuth = await this.authorization.isLoggedIn();
  }

  checkRefererType() {
    const params = new URLSearchParams(document.location.search);
    const ref = params.get('ref');
    if (ref !== null) {
      if (ref!.includes('ebook')) {
        this.refererType = 'ebook';
        this.selectTitle.element.style.display = 'none';
        this.select.element.style.display = 'none';
      }
    }
  }

  redrawPage(target: HTMLElement) {
    this.updateGroup(this.group);
    this.levelTitle.element.innerHTML = `${target.innerHTML}`;
  }

  async createGame() {
    if (this.refererType === 'ebook') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        this.group = JSON.parse(userData!).group;
        this.page = JSON.parse(userData!).page;
        const isExpired = this.authorization.JwtHasExpired();
        if (this.isAuth && isExpired === false) {
          this.createAggregatedArray();
        } else {
          this.createGamesArray();
        }
      }
    } else {
      const isExpired = this.authorization.JwtHasExpired();
      if (this.isAuth && isExpired === false) {
        this.createRandomAggregatedArray();
      } else {
        this.createRandomArray();
      }
    }
  }

  async createAggregatedArray() {
    await this.createArraysQuestionsWithoutEasy();

    const wordsPerPage = 20;

    // create array of answers
    this.createArrayOfPage(29);
    this.shuffleArray(this.arrayOfPage);
    this.arrayOfPage = this.arrayOfPage.slice(0, 3);

    const arrPromises = this.arrayOfPage.map(
      (item: number) => this.getAggregatedWords(this.filter.all, wordsPerPage, item, this.group),
    );
    const arr: Word[] = await Promise.all(arrPromises);
    const answers = [];
    answers.push(this.words, arr.flat());
    this.allAnswers = answers.flat();
    // // this.prepareGame();
    this.startGame();
  }

  async createArraysQuestionsWithoutEasy() {
    let arrayOfPage = [];

    for (let i = 0; i <= this.page; i += 1) {
      arrayOfPage.push(i);
    }
    arrayOfPage = arrayOfPage.reverse();
    const wordsPerPage = 20;

    const arrPromises = arrayOfPage.map(
      (item: number) => this.getAggregatedWords(this.filter.all, wordsPerPage, item, this.group),
    );
    const arr: Word[] = await Promise.all(arrPromises);

    let questions = [];
    questions.push(arr.flat());
    questions = questions.flat();
    this.words = questions.filter((item) => {
      if (item.userWord !== null && item.userWord !== undefined) {
        if (item.userWord.difficulty !== 'easy') {
          return item;
        }
      } else {
        return item;
      }
      return item;
    });

    if (this.words.length > 20) {
      this.words = this.words.slice(0, 20);
    }
  }

  createRandomAggregatedArray() {
    this.page = this.getRandomPage(0, 29);
    this.createAggregatedArray();
  }

  async getAggregatedWords(filter: {}, wordsPerPage: number, page: number, group?: number) {
    const dataObj = this.getUserData();
    const id = dataObj.userId;
    const { token } = dataObj;
    const data = await getUserAggregatedWords({
      id, group, page, wordsPerPage, filter, token,
    });

    return data[0].paginatedResults;
  }

  async createGamesArray() {
    // prepare array words hat we will use
    this.words = await this.getWords(this.group, this.page);
    this.words = this.shuffleArray(this.words);

    // create array of answers
    this.createArrayOfPage(29);
    this.shuffleArray(this.arrayOfPage);
    this.arrayOfPage = this.arrayOfPage.slice(0, 3);
    const arrPromises = this.arrayOfPage.map((item: number) => this.getWords(this.group, item));
    const arr: Word[] = await Promise.all(arrPromises);
    const answers = [];
    answers.push(this.words, arr.flat());
    this.allAnswers = answers.flat();
    // this.prepareGame();
    this.startGame();
  }

  createRandomArray() {
    this.page = this.getRandomPage(0, 29);
    this.createArrayOfPage(29);
    this.createGamesArray();
  }

  createArrayOfPage(max: number) {
    for (let i = 0; i <= max; i += 1) {
      this.arrayOfPage.push(i);
    }
    this.arrayOfPage = this.arrayOfPage.filter((page) => page !== this.page);
  }

  async getWords(group: number, page: number) {
    const words = await getWords({ group, page });
    return words.items;
  }

  async startGame() {
    if (this.words.length >= 18) {
      this.words = this.shuffleArray(this.words);
      this.prepareGame();
      this.clear();

      this.game = new Game(this.element, this.gameObject);

      this.game.nextBtn.element.addEventListener('click', () => {
        if (this.words.length >= 18) {
          this.staticsObjects.push(this.game!.staticsObject);
          this.startGame();
        } else {
          // this.staticsObjects.push(game.staticsObject);
          this.staticsObjects.push(this.game!.staticsObject);
          this.showResult(this.staticsObjects);
        }
      });
    } else {
      this.staticsObjects.push(this.game!.staticsObject);
      this.showResult(this.staticsObjects);
    }
  }

  prepareGame() {
    const wordObject = this.words[0];
    this.words = this.words.slice(1);

    let allAnswers = this.shuffleArray(this.allAnswers);
    allAnswers = allAnswers.filter((item) => item !== wordObject);
    const answers = [];
    answers.push(wordObject, allAnswers.slice(0, 4));
    const newAnswers = this.shuffleArray(answers).flat();
    this.gameObject = {
      word: wordObject,
      answers: newAnswers,
    };
  }

  showResult(result: StatisticsObject[]) {
    this.element.innerHTML = '';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const resultPage = new Result(this.element, result);
  }

  clear() {
    this.element.innerHTML = '';
  }

  getRandomPage = (firstPageNumber: number, amoutOfPages: 29) => {
    const max = amoutOfPages;
    const min = firstPageNumber;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      // eslint-disable-next-line no-param-reassign
      arr[i] = arr[j];
      // eslint-disable-next-line no-param-reassign
      arr[j] = temp;
    }
    return arr;
  }

  getUserData() {
    const userAuthData = localStorage.getItem(authStorageKey);
    const { userId } = JSON.parse(userAuthData!);
    const { token } = JSON.parse(userAuthData!);
    const dataObj: IDataObj = {
      userId,
      token,
    };
    return dataObj;
  }
}

export default AudioGameContainer;
