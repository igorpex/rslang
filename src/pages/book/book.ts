import {
  getUserAggregatedWords, getUserAggregatedWordsWithoutGroup, getWords,
} from '../../api/api';
import Auth from '../../components/auth/auth/auth';
import BookContainer from '../../components/book-container/bookContainer';
import { IDataObj, Word } from '../../interfaces';
import Component from '../../utils/component';
import { authStorageKey } from '../../utils/config';
import './book.scss';

class Book extends Component {
  bookContainer: BookContainer;

  authorization: Auth;

  isAuth: boolean;

  filter = {
    hard: { 'userWord.difficulty': 'hard' },
    all: {
      $or: [{ 'userWord.difficulty': 'hard' }, { userWord: null }, { 'userWord.difficulty': 'easy' },
        { 'userWord.difficulty': 'normal' }],
    },
    easy: { 'userWord.difficulty': 'easy' },
  };

  page = 0;

  group = 0;

  input: HTMLInputElement;

  cross: HTMLElement;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['book']);
    this.isAuth = false;

    this.bookContainer = new BookContainer(this.element);
    window.addEventListener('beforeunload', () => {
      this.saveInLocalStorage();
    });

    this.getLocalStorage();

    this.authorization = new Auth();
    this.checkAuthorization();

    this.updateGroup();
    this.updatePage();

    // search input functionality
    this.input = document.querySelector('.book-options__search-input') as HTMLInputElement;
    this.input.placeholder = 'Найти слово на странице...';
    this.cross = (document.querySelector('.book-options__search-cross') as HTMLElement);

    this.input.addEventListener('input', () => {
      if (this.input.value.length !== 0) {
        this.cross.classList.add('active');
      } else {
        this.cross.classList.remove('active');
      }
      this.checkAuthorization();
    });

    this.cross.addEventListener('click', () => {
      this.input.value = '';
      this.cross.classList.remove('active');
      this.checkAuthorization();
    });
  }

  async checkAuthorization() {
    const data = await this.authorization.isLoggedIn();
    this.isCheck(data);
  }

  isCheck(data: boolean) {
    if (data) {
      this.isAuth = true;
      this.bookContainer.isAuth = true;
      this.createForAuthUser();
    } else {
      this.isAuth = false;
      this.bookContainer.isAuth = false;
      this.createForAnonymous();
    }
  }

  async createForAuthUser() {
    const isExpired = this.authorization.JwtHasExpired();
    if (isExpired === false) {
      this.bookContainer.clear();

      const wordsPerPage = 20;
      const { page } = this;
      const { group } = this;

      const data = await this.getAggregatedWords(this.filter.all, wordsPerPage, page, group);
      let words = data[0].paginatedResults;
      this.checkIsAllWordsEasy(words);
      if ((document.querySelector('.book-options__search-input') as HTMLInputElement).value.length !== 0) {
        const { value } = document.querySelector('.book-options__search-input') as HTMLInputElement;
        words = words.filter(
          (item: Word) => item.word.startsWith(value) || item.wordTranslate.startsWith(value),
        );
      }

      this.saveInLocalStorage();
      this.bookContainer.addWords(words, this.group, this.isAuth);
    } else {
      this.isAuth = false;
      this.bookContainer.isAuth = false;
      this.createForAnonymous();
    }
  }

  createForAnonymous() {
    this.getCards(this.group, this.page, this.isAuth);
  }

  private async getCards(group: number, page: number, isAuth: boolean) {
    const data = await getWords({ group, page });
    if (data) {
      let cardsArr: Word[] = data.items;
      if ((document.querySelector('.book-options__search-input') as HTMLInputElement).value.length !== 0) {
        const { value } = document.querySelector('.book-options__search-input') as HTMLInputElement;
        cardsArr = cardsArr.filter(
          (item: Word) => item.word.startsWith(value) || item.wordTranslate.startsWith(value),
        );
      }
      this.saveInLocalStorage();
      this.bookContainer.addWords(cardsArr, group, isAuth);
    }
  }

  private async getDifficultWords(group: number) {
    const isExpired = this.authorization.JwtHasExpired();
    if (this.isAuth === true && isExpired === false) {
      this.bookContainer.clear();
      const wordsPerPage = 3600;
      const pageSearch = 0;
      const data = await
      this.getAggregatedWordsWithoutGroup(this.filter.hard, wordsPerPage, pageSearch);
      const words = data[0].paginatedResults;
      this.saveInLocalStorage();
      this.bookContainer.addWords(words, group, this.isAuth);
      this.bookContainer.bookOptions.pagination.makeButtonDissabled();
    } else {
      this.bookContainer.bookOptions.pagination.makeButtonDissabled();
    }
  }

  async getAggregatedWords(filter: {}, wordsPerPage: number, page: number, group?: number) {
    const dataObj = this.getUserData();
    const id = dataObj.userId;
    const { token } = dataObj;
    const data = await getUserAggregatedWords({
      id, group, page, wordsPerPage, filter, token,
    });

    return data;
  }

  async getAggregatedWordsWithoutGroup(
    filter: {},
    wordsPerPage: number,
    page: number,
  ) {
    const dataObj = this.getUserData();
    const id = dataObj.userId;
    const { token } = dataObj;
    const data = await getUserAggregatedWordsWithoutGroup({
      id, page, wordsPerPage, filter, token,
    });

    return data;
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

  updatePage() {
    this.bookContainer.updatePage = (page) => {
      this.page = page;
      if (this.isAuth) {
        console.log(true);
        this.createForAuthUser();
      } else {
        this.getCards(this.group, this.page, this.isAuth);
      }
    };
  }

  updateGroup() {
    this.bookContainer.updateGroup = (group) => {
      if (group < 6) {
        this.group = group;
        this.bookContainer.bookOptions.pagination.removeButtonDissabled();
        if (this.isAuth) {
          this.createForAuthUser();
        } else {
          this.getCards(this.group, this.page, this.isAuth);
        }
      } else if (group === 6) {
        this.bookContainer.bookOptions.pagination.makeButtonDissabled();
        this.group = group;
        if (this.isAuth === true) {
          this.getDifficultWords(group);
        } else if (this.isAuth === false) {
          this.bookContainer.mainContent.element.innerHTML = '';
          this.bookContainer.mainContent.element.innerHTML = 'Вы должны авторизоваться!';
        }
      }
    };
  }

  checkIsAllWordsEasy(words: Word[]) {
    console.log('check');
    // eslint-disable-next-line array-callback-return, consistent-return
    const filteredWords = words.filter((word) => {
      if (word.userWord !== undefined && word.userWord !== null) {
        if (word.userWord.difficulty === 'easy') {
          return word;
        }
      }
    });
    console.log(filteredWords.length);
    if (filteredWords.length === 20) {
      this.bookContainer.element.classList.add('changed');
    } else {
      this.bookContainer.element.classList.remove('changed');
    }
  }

  saveInLocalStorage(words?: Word[]) {
    const userData = {
      group: this.group,
      page: this.page,
      words,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  async getLocalStorage() {
    const userData = localStorage.getItem('userData');
    if (userData !== undefined && userData !== null) {
      this.page = JSON.parse(userData!).page;
      this.group = JSON.parse(userData!).group;
      if (this.group === 6) {
        await this.reOpenDifficult();
        this.getDifficultWords(this.group);
      }
    }
  }

  async reOpenDifficult() {
    this.authorization = new Auth();
    const data = await this.authorization.isLoggedIn();
    if (data) {
      this.isAuth = true;
    }
  }

  /* async createByNameForAnonymous(value: string, group: number, page: number) {
    const data = await getWords({ group, page });
    const cards: Word[] = data.items;
    console.log(cards);
    if (data) {
      const cardsArr: Word = data.items[0];
      this.bookContainer.addWord(cardsArr, this.isAuth);
    }
  } */
}

export default Book;
