import { ids } from 'webpack';
import {
  getAllWords, getUserAggregatedWords, getUserAggregatedWordsWithoutGroup, getUserAllAggregatedWords, getUserWordById, getUserWords, getWordById, getWords,
} from '../../api/api';
import Auth from '../../components/auth/auth/auth';
import BookContainer from '../../components/book-container/bookContainer';
import { DifficultWord, IDataObj, Word } from '../../interfaces';
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
      const words = data[0].paginatedResults;
      this.saveInLocalStorage(words);
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
      const cardsArr: Word[] = data.items;
      this.saveInLocalStorage(cardsArr);
      this.bookContainer.addWords(cardsArr, group, isAuth);
    }
  }

  private async getDifficultWords(group: number, page: number) {
    const isExpired = this.authorization.JwtHasExpired();
    if (this.isAuth === true && isExpired === false) {
      this.bookContainer.clear();
      const wordsPerPage = 3600;
      const pageSearch = 0;
      const data = await this.getAggregatedWordsWithoutGroup(this.filter.hard, wordsPerPage, pageSearch);
      const words = data[0].paginatedResults;
      this.saveInLocalStorage(words);
      this.bookContainer.addWords(words, group, this.isAuth);
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

  async getAggregatedWordsWithoutGroup(filter: {}, wordsPerPage: number, page: number, group?: number) {
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
          this.getDifficultWords(group, this.page);
        } else if (this.isAuth === false) {
          this.bookContainer.mainContent.element.innerHTML = '';
          this.bookContainer.mainContent.element.innerHTML = 'Вы должны авторизоваться!';
        }
      }
    };
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
        this.getDifficultWords(this.group, this.page);
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
}

export default Book;
