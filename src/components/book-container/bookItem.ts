/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  baseUrl, createUserWord, getUserWordById, getUserWordByIdWithStatus, updateUserWord,
} from '../../api/api';
import { Difficulty, Word } from '../../interfaces';
import Component from '../../utils/component';
import { authStorageKey } from '../../utils/config';
import Auth from '../auth/auth/auth';
import UIButton from '../UI/button/button';
import './bookContainer.scss';
import playButtonImg from '../../assets/svg/play-button.svg';
import { createEmptyUserWord } from '../shared/emptyUserWord/emptyUserWord';

class BookItem extends Component {
  // addToLearned: (cardId: number) => void = () => {};
  // addToDifficult: (cardId: number) => void = () => {};

  private card: Word;

  private learnButton: UIButton;

  private addToDifficultButton: UIButton;

  private statisticsButton: UIButton;

  audioButton: UIButton;

  isPlay: boolean;

  audio: HTMLAudioElement;

  authorization: Auth;
  // private modalWindow: Component;
  // private overlay: Component;

  lernedWords: Word[];

  difficultWords: Word[];

  isDifficult: boolean;

  isEasy: boolean;

  constructor(parentNode: HTMLElement, card: Word, isDifficult: boolean, isEasy: boolean) {
    super(parentNode, 'div', ['book-item']);
    this.authorization = new Auth();
    this.card = card;
    this.lernedWords = [];
    this.difficultWords = [];

    this.isDifficult = isDifficult;
    this.isEasy = isEasy;

    const mainBlock = new Component(this.element, 'div', ['main-block']);
    const leftItem = new Component(mainBlock.element, 'div', ['book-item__left']);
    const rightItem = new Component(mainBlock.element, 'div', ['book-item__right']);

    leftItem.element.style.backgroundImage = `url(${baseUrl}/${this.card.image})`;

    const rightItemHeader = new Component(rightItem.element, 'div', ['right__header']);
    const groupIcon = new Component(rightItemHeader.element, 'span', ['item__icon', `group-${this.card.group + 1}`], `${this.card.group + 1}`);
    const cardName = new Component(rightItemHeader.element, 'p', ['item__name'], `${this.card.word} - ${this.card.transcription}`);
    this.audioButton = new UIButton(rightItemHeader.element, ['item__audio-button'], '', false);
    this.audioButton.element.style.backgroundImage = `url(${playButtonImg})`;
    this.isPlay = false;
    this.audio = new Audio();
    this.audioButton.onClickButton = () => { this.loadAudio(); };

    const cardTranslate = new Component(rightItem.element, 'p', ['item__translate'], `${this.card.wordTranslate}`);

    const textMeaning = document.createElement('p');
    textMeaning.className = 'item__text-meaning';
    textMeaning.innerHTML = this.card.textMeaning;
    rightItem.element.appendChild(textMeaning);

    const textMeaningTranslate = new Component(rightItem.element, 'p', ['item__text-meaning-translate'], `${this.card.textMeaningTranslate}`);

    const textExample = document.createElement('p');
    textExample.innerHTML = this.card.textExample;
    textExample.className = 'item__text-example';
    rightItem.element.appendChild(textExample);

    const textExampleTranslate = new Component(rightItem.element, 'p', ['item__text-example-translate'], `${this.card.textExampleTranslate}`);

    // Buttons
    const buttonContainer = new Component(this.element, 'div', ['item__buttons']);
    this.learnButton = new UIButton(buttonContainer.element, ['item__remove-button'], 'Изучено');
    this.learnButton.element.style.display = 'none';

    this.addToDifficultButton = new UIButton(buttonContainer.element, ['item__add-button'], '');
    this.addToDifficultButton.element.style.display = 'none';

    this.statisticsButton = new UIButton(buttonContainer.element, ['item__statistics-button'], 'Статистика');
    if (!this.card.userWord || this.card.userWord.optional.dateNew === 0) {
      this.statisticsButton.setDisabled(true);
    } else {
      this.statisticsButton.element.textContent = '';
      this.statisticsButton.element.innerHTML = `
      ${this.card.userWord.optional.sprint.successCounter
      + this.card.userWord.optional.audioChallenge.successCounter} &#10003; , 
      ${this.card.userWord.optional.sprint.failureCounter
      + this.card.userWord.optional.audioChallenge.failureCounter} &#10007; Статистика`;
    }
    this.statisticsButton.element.style.display = 'none';

    this.checkIsEasy();
    this.checkIsDifficult();

    this.addToDifficultButton.onClickButton = () => {
      const isExpired = this.authorization.JwtHasExpired();
      if (isExpired === false) {
        if (this.isDifficult === false) {
          this.addToDifficult(this.card, this.difficultWords);
        } else if (this.isDifficult === true) {
          this.removeFromDifficult(this.card);
        }
      } else {
        window.location.reload();
      }
    };
    this.statisticsButton.onClickButton = () => {
      const isExpired = this.authorization.JwtHasExpired();
      if (isExpired === false) {
        this.openWindow();
      } else {
        window.location.reload();
      }
    };
    this.learnButton.onClickButton = async () => {
      const isExpired = this.authorization.JwtHasExpired();
      if (isExpired === false) {
        if (this.isEasy === false) {
          this.makeWordDisabled();
          this.checkBackgroundColor();
          if (this.isDifficult) {
            await this.updateWord();
            this.isEasy = true;
          } else {
            this.addToLearned(this.card);
          }
        } else {
          console.log('not aesy');
          this.removeFromEasy();
        }
      } else {
        window.location.reload();
      }
    };
  }

  async updateWord() {
    this.deleteRemoveButtonClass();
    this.isDifficult = false;
    await this.updateWordDifficulty('easy');
    if (this.element.id === 'group-7') {
      this.element.remove();
    }
  }

  async updateWordDifficultyNew(difficulty: 'hard' | 'easy' | 'normal') {
    const dataObj = this.getUserData();
    const currentUserWord = await getUserWordById(dataObj.userId, this.card._id, dataObj.token);
    if (difficulty === 'normal') {
      this.isDifficult = false;
      this.isEasy = false;
      currentUserWord.optional.rightInARow = 0;
      currentUserWord.optional.dateEasy = 0;
    }
    if (difficulty === 'hard') {
      this.isDifficult = true;
      this.isEasy = false;
      currentUserWord.optional.rightInARow = 0;
      currentUserWord.optional.dateEasy = 0;
    }
    if (difficulty === 'easy') {
      this.isEasy = true;
      this.isDifficult = false;
      currentUserWord.optional.dateEasy = Date.now();
    }

    const userWord = {
      difficulty,
      optional: currentUserWord.optional,
    };
    await updateUserWord(dataObj.userId, this.card._id, dataObj.token, userWord);
  }

  async updateWordDifficulty(difficulty: 'hard' | 'easy' | 'normal') {
    const dataObj = this.getUserData();
    const currentUserWord = await getUserWordById(dataObj.userId, this.card._id, dataObj.token);
    const currentDifficulty = currentUserWord.difficulty;
    delete currentUserWord.id;
    delete currentUserWord.wordId;

    if (difficulty === 'normal') {
      this.isDifficult = false;
      this.isEasy = false;
    }
    if (difficulty === 'hard') {
      this.isDifficult = true;
      this.isEasy = false;
    }
    if (difficulty === 'easy') {
      this.isEasy = true;
      this.isDifficult = false;
    }

    if (currentDifficulty !== 'easy' && difficulty === 'easy') {
      currentUserWord.optional.dateEasy = Date.now();
    } else if (currentDifficulty === 'easy' && difficulty !== 'easy') {
      currentUserWord.optional.dateEasy = 0;
      currentUserWord.optional.rightInARow = 0;
    }
    currentUserWord.difficulty = difficulty;

    await updateUserWord(dataObj.userId, this.card._id, dataObj.token, currentUserWord);
  }

  async removeFromEasy() {
    // const params = this.getUserData();
    this.removeWordDisabled();
    // deleteUserWord(params.userId, this.card._id, params.token);
    await this.updateWordDifficulty('normal');
    this.isEasy = false;
  }

  checkIsDifficult() {
    if (this.isDifficult) {
      this.addRemoveButtonClass();
    } else {
      this.deleteRemoveButtonClass();
    }
  }

  checkIsEasy() {
    if (this.isEasy) {
      this.makeWordDisabled();
    }
  }

  async addToLearned(card: Word) {
    await this.createOrUpdateUserWord('easy');
    this.isEasy = true;
  }

  async addToDifficult(card: Word, arr: Word[]) {
    this.addRemoveButtonClass();
    await this.createOrUpdateUserWord('hard');
    this.isDifficult = true;
  }

  async removeFromDifficult(card: Word) {
    this.deleteRemoveButtonClass();
    const params = this.getUserData();
    try {
      await this.updateWordDifficulty('normal');
    } catch {
      alert('Войдите заново');
    }

    this.isDifficult = false;
    if (this.element.id === 'group-7') {
      this.element.remove();
    }
  }

  playAudio(i: number) {
    const audioObj = [this.card.audio, this.card.audioExample, this.card.audioMeaning];
    this.audio.src = `${baseUrl}/${audioObj[i]}`;
    this.audio.play();
  }

  loadAudio() {
    let count = 0;
    if (this.isPlay === false) {
      this.audio = new Audio();
      this.playAudio(count);

      this.audio.addEventListener('ended', () => {
        if (count === 2) {
          this.audio.pause();
          this.isPlay = false;
        } else {
          count += 1;
          this.playAudio(count);
        }
      });
      this.isPlay = true;
    } else {
      count = 0;
      this.audio.pause();
      this.isPlay = false;
    }
  }

  addButtons() {
    this.learnButton.element.style.display = 'block';
    this.addToDifficultButton.element.style.display = 'block';
    this.statisticsButton.element.style.display = 'block';
  }

  addRemoveButtonClass() {
    this.addToDifficultButton.element.innerHTML = 'Удалить из сложных';
    this.addToDifficultButton.element.classList.add('remove-btn');
  }

  deleteRemoveButtonClass() {
    this.addToDifficultButton.element.innerHTML = 'Добавить в сложные';
    this.addToDifficultButton.element.classList.remove('remove-btn');
  }

  makeWordDisabled() {
    this.element.setAttribute('data-word', 'learned');
    this.element.style.opacity = '0.6';
    this.learnButton.element.innerHTML = 'удалить из изученных';
    this.addToDifficultButton.setDisabled(true);
    // this.statisticsButton.setDisabled(true);
  }

  removeWordDisabled() {
    this.element.setAttribute('data-word', 'normal');
    this.element.style.opacity = '1.0';
    this.learnButton.element.innerHTML = 'изучено';
    this.addToDifficultButton.setDisabled(false);
    this.checkBackgroundColor();
    // this.statisticsButton.setDisabled(false);
  }

  checkBackgroundColor() {
    const bookItem = document.querySelectorAll('.book-item');
    let count = 0;
    bookItem.forEach((item) => {
      if (item.getAttribute('data-word') === 'learned') {
        count += 1;
      }
    });
    const bookContainer = document.querySelector('.book-container');
    if (count === 20 && !bookContainer?.classList.contains('changed')) {
      bookContainer!.classList.add('changed');
    } else if (count < 20 && bookContainer?.classList.contains('changed')) {
      bookContainer.classList.remove('changed');
    }
  }

  async createOrUpdateUserWord(difficulty: 'hard' | 'easy' | 'normal') {
    const auth = new Auth();
    if (!auth.JwtHasExpired()) {
      const userAuthData = localStorage.getItem(authStorageKey);
      const { userId, token } = JSON.parse(userAuthData!);
      // case if user word does exist - when get curren user word info, update it and PUT to server
      const userWordWStatus = await getUserWordByIdWithStatus(userId, this.card._id, token);

      if (userWordWStatus.status === 404) {
        console.log('word is new, not in userWords');
        const newUserWord = createEmptyUserWord();
        await createUserWord(userId, this.card._id, token, newUserWord);
        await this.updateWordDifficulty(difficulty);
      } else if (userWordWStatus.status === 200) {
        await this.updateWordDifficulty(difficulty);
      } else {
        console.log('Error creating or updating user word');
      }
    }
  }

  createWord(type: Difficulty) {
    const userWord = createEmptyUserWord();
    userWord.difficulty = type;
    return userWord;
  }

  openWindow() {
    const modalWindow = document.querySelector('.modal-window__container')! as HTMLElement;
    this.createWindow(modalWindow);
    const overlay = document.querySelector('.overlay')!;
    overlay.classList.add('open');

    modalWindow.classList.add('open');

    overlay.addEventListener('click', () => {
      this.closeWindow();
    });
  }

  closeWindow() {
    // const modalWindow = document.querySelector('.item__statistics-window')!;
    const overlay = document.querySelector('.overlay')!;
    overlay.classList.remove('open');
  }

  createWindow(modalWindow: HTMLElement) {
    const modalTitleBlock = new Component(modalWindow, 'div', ['window__title']);
    const title = new Component(modalTitleBlock.element, 'p', ['title__name'], 'Статистика по слову:');
    const word = new Component(modalTitleBlock.element, 'p', ['title__word'], `${this.card.word}`);
    const table = new Component(modalWindow, 'table', ['window-table']);
    const headArr = ['Мини-игра', 'Правильно', 'Неправильно'];
    const sprintArr = ['Спринт', `${this.card.userWord ? this.card.userWord.optional.sprint.successCounter : 0}`, `${this.card.userWord ? this.card.userWord.optional.sprint.failureCounter : 0} `];
    const audioGameArr = ['Аудиовызов', `${this.card.userWord ? this.card.userWord.optional.audioChallenge.successCounter : 0}`, `${this.card.userWord ? this.card.userWord.optional.audioChallenge.failureCounter : 0} `];
    const firstRow = new Component(table.element, 'tr', ['main-row']);
    this.createRow(headArr, firstRow.element, 'th');
    const secondRow = new Component(table.element, 'tr', ['row']);
    this.createRow(sprintArr, secondRow.element, 'td');
    const thirdRow = new Component(table.element, 'tr', ['row']);
    this.createRow(audioGameArr, thirdRow.element, 'td');
  }

  createRow(arr: string[], element: HTMLElement, tag: keyof HTMLElementTagNameMap) {
    for (let i = 0; i < arr.length; i += 1) {
      const td = new Component(element, tag, ['table-header'], `${arr[i]}`);
    }
  }

  getUserData() {
    const userAuthData = localStorage.getItem(authStorageKey);
    const { userId } = JSON.parse(userAuthData!);
    const { token } = JSON.parse(userAuthData!);
    return {
      userId,
      token,
    };
  }
}

export default BookItem;
