import { baseUrl, createUserWord, deleteUserWord, getUserWords, updateUserWord } from "../../api/api";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
import { authStorageKey } from "../../utils/config";
import UIButton from "../UI/button/button";
import './bookContainer.scss'

class BookItem extends Component{
    // addToLearned: (cardId: number) => void = () => {};
    // addToDifficult: (cardId: number) => void = () => {};
    
    private card: Word;
    private learnButton: UIButton;
    private addToDifficultButton: UIButton;
    private statisticsButton: UIButton;
    // private modalWindow: Component;
    // private overlay: Component;

    lernedWords: Word[];
    difficultWords: Word[];

    isDifficult: boolean;
    isEasy: boolean;

    constructor(parentNode: HTMLElement, card: Word, isDifficult: boolean, isEasy: boolean){
        super(parentNode, 'div', ['book-item']);
        this.card = card;
        this.lernedWords  = [];
        this.difficultWords = [];

        this.isDifficult = isDifficult;
        this.isEasy = isEasy;
        
        const mainBlock = new Component(this.element, 'div', ['main-block'])
        const leftItem = new Component(mainBlock.element, 'div', ['book-item__left']);
        const rightItem = new Component(mainBlock.element, 'div', ['book-item__right']);

        leftItem.element.style.backgroundImage = `url(${baseUrl}/${this.card.image})`;

        const leftItemHeader = new Component(rightItem.element, 'div', ['left__header']);
        const groupIcon = new Component(leftItemHeader.element, 'span', ['item__icon', `group-${this.card.group + 1}`], `${this.card.group + 1}`);
        const cardName = new Component(leftItemHeader.element, 'p', ['item__name'], `${this.card.word} - ${this.card.transcription}`);
        const audioButton = new UIButton(leftItemHeader.element, ['item__audio-button'], '', false);
        audioButton.element.style.backgroundImage = 'url(./play-button.svg)';
        audioButton.onClickButton = ()=> { this.playAudio()};

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
        
        //Buttons
        const buttonContainer = new Component(this.element, 'div', ['item__buttons']);
        this.learnButton = new UIButton(buttonContainer.element, ['item__remove-button'], 'Изучено');
        this.learnButton.element.style.display = 'none';
        
        this.addToDifficultButton = new UIButton(buttonContainer.element, ['item__add-button'], '');
        this.addToDifficultButton.element.style.display = 'none';
        
        this.statisticsButton = new UIButton(buttonContainer.element, ['item__statistics-button'], 'Статистика');
        this.statisticsButton.element.style.display = 'none';
        
        this.checkIsEasy();
        this.checkIsDifficult();
        
        // window
        // this.overlay = new Component(document.body, 'div', ['item__overlay']);
        // this.modalWindow = new Component(this.element, 'div', ['item__statistics-window']);
        // const closeBtn = new UIButton(this.modalWindow.element, ['modal__close-btn'], '', false);
        // closeBtn.element.style.backgroundImage = `url(./close-btn.svg)`;
        // closeBtn.onClickButton = () => {
        //     this.closeWindow();
        // }
        // const modalTitleBlock = new Component(this.modalWindow.element, 'div', ['window__title']);
        // const title = new Component(modalTitleBlock.element, 'h3', ['title'], 'Статистика:');
        // const word = new Component(modalTitleBlock.element, 'p', ['title__word'], `${this.card.word}`);
        // const table = new Component(this.modalWindow.element, 'table', ['window-table']);
        // const headArr = ['Мини-игра', 'Правильно', 'Неправильно'];
        // const sprintArr = ['Спринт', '0', '0'];
        // const audioGameArr = ['Аудиовызов', '0', '0'];
        // const firstRow = new Component(table.element, 'tr', ['firs-row']);
        // this.createRow(headArr, firstRow.element);
        // const secondRow = new Component(table.element, 'tr', ['second-row']);
        // this.createRow(sprintArr, secondRow.element);
        // const thirdRow = new Component(table.element, 'tr', ['second-row']);
        // this.createRow(audioGameArr, thirdRow.element);
        


        this.learnButton.onClickButton = () => {
            this.makeWordDisabled();
            this.addToLearned(this.card);
        };
        this.addToDifficultButton.onClickButton = () => {
            if(this.isDifficult === false) {
                this.addRemoveButtonClass();
                this.addToDifficult(this.card, this.difficultWords);
                this.isDifficult = true;
            } else if (this.isDifficult === true) {
                this.deleteRemoveButtonClass();
                this.removeFromDifficult(this.card);
                this.isDifficult = false;
            }
        };
        this.statisticsButton.onClickButton = () => {
            this.openWindow();
        }
        
    }


    checkIsDifficult() {
        if(this.isDifficult){
            this.addRemoveButtonClass();
        } else {
            this.deleteRemoveButtonClass();
        }
    }
    checkIsEasy(){
        if(this.isEasy){
            this.makeWordDisabled();
        }
    }
    addToLearned(card: Word) {
        const params = this.createWord('easy');
        createUserWord(params.dataObj.userId, card._id, params.dataObj.token, params.userWord);
    }
    addToDifficult(card: Word, arr: Word[]) {
        const params = this.createWord('hard');
        createUserWord(params.dataObj.userId, card._id, params.dataObj.token, params.userWord);
    }
    async removeFromDifficult(card: Word) {
        const params = this.getUserData();
    //     const params = this.createWord('easy');
       
    //    await updateUserWord(params.dataObj.userId, card._id, params.dataObj.token, params.userWord);
       deleteUserWord(params.userId, this.card._id, params.token);
       if(this.element.id === 'group-7'){
        this.element.remove();
       }
    }

    playAudio() {
        const audio = new Audio();
        audio.src = `${baseUrl}/${this.card.audio}`;
        audio.play();
    }
    
    addButtons(){
        this.learnButton.element.style.display = 'block';
        this.addToDifficultButton.element.style.display='block';
        this.statisticsButton.element.style.display='block';
    }

    addRemoveButtonClass(){
        this.addToDifficultButton.element.innerHTML = 'Удалить из сложных';
        this.addToDifficultButton.element.classList.add('remove-btn');
        
    }
    deleteRemoveButtonClass(){
        this.addToDifficultButton.element.innerHTML = 'Добавить в сложные';
        this.addToDifficultButton.element.classList.remove('remove-btn');
    }
    makeWordDisabled(){
        this.element.style.opacity = '0.6';
        this.learnButton.setDisabled(true);
        this.addToDifficultButton.setDisabled(true);
        this.statisticsButton.setDisabled(true);
    }
    createWord(type: string){
        const dataObj = this.getUserData();
        const userWord = {
            difficulty: type,
            optional: {},
        }
        return {
            dataObj: dataObj,
            userWord: userWord
        }
    }
    openWindow() {
        
        const modalWindow = document.querySelector('.modal-window__container')! as HTMLElement;
        this.createWindow(modalWindow);
        const overlay = document.querySelector('.overlay')!;
        overlay.classList.add('open');

        modalWindow.classList.add('open');
        
        overlay.addEventListener('click', () => {
            this.closeWindow();
        })
    }
    closeWindow() {
        const modalWindow = document.querySelector('.item__statistics-window')!;
        modalWindow.classList.remove('open');
        const overlay = document.querySelector('.overlay')!;
        overlay.classList.remove('open');
        
    }
    createWindow(modalWindow: HTMLElement){
        const modalTitleBlock = new Component(modalWindow, 'div', ['window__title']);
        const title = new Component(modalTitleBlock.element, 'p', ['title__name'], 'Статистика по слову:');
        const word = new Component(modalTitleBlock.element, 'p', ['title__word'], `${this.card.word}`);
        const table = new Component(modalWindow, 'table', ['window-table']);
        const headArr = ['Мини-игра', 'Правильно', 'Неправильно'];
        const sprintArr = ['Спринт', '0', '0'];
        const audioGameArr = ['Аудиовызов', '0', '0'];
        const firstRow = new Component(table.element, 'tr', ['main-row']);
        this.createRow(headArr, firstRow.element, 'th');
        const secondRow = new Component(table.element, 'tr', ['row']);
        this.createRow(sprintArr, secondRow.element, 'td');
        const thirdRow = new Component(table.element, 'tr', ['row']);
        this.createRow(audioGameArr, thirdRow.element, 'td');
        

    }
    createRow(arr: string[], element: HTMLElement, tag: keyof HTMLElementTagNameMap){
        for(let i = 0; i < arr.length; i++) {
            const td = new Component(element, tag, ['table-header'], `${arr[i]}`);
        }
    }
    getUserData(){
        const userAuthData = localStorage.getItem(authStorageKey);
        const userId = JSON.parse(userAuthData!).userId;
        const token = JSON.parse(userAuthData!).token;
        return {
            userId: userId,
            token: token,
        }
    }
}

export default BookItem;