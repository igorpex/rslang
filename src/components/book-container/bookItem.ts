import { baseUrl, createUserWord, deleteUserWord, getUserWords, updateUserWord } from "../../api/api";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
import { authStorageKey } from "../../utils/config";
import Auth from "../auth/auth/auth";
import UIButton from "../UI/button/button";
import './bookContainer.scss'

class BookItem extends Component{
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

    constructor(parentNode: HTMLElement, card: Word, isDifficult: boolean, isEasy: boolean){
        super(parentNode, 'div', ['book-item']);
        this.authorization = new Auth();
        this.card = card;
        this.lernedWords  = [];
        this.difficultWords = [];

        this.isDifficult = isDifficult;
        this.isEasy = isEasy;
        
        const mainBlock = new Component(this.element, 'div', ['main-block'])
        const leftItem = new Component(mainBlock.element, 'div', ['book-item__left']);
        const rightItem = new Component(mainBlock.element, 'div', ['book-item__right']);

        leftItem.element.style.backgroundImage = `url(${baseUrl}/${this.card.image})`;

        const rightItemHeader = new Component(rightItem.element, 'div', ['right__header']);
        const groupIcon = new Component(rightItemHeader.element, 'span', ['item__icon', `group-${this.card.group + 1}`], `${this.card.group + 1}`);
        const cardName = new Component(rightItemHeader.element, 'p', ['item__name'], `${this.card.word} - ${this.card.transcription}`);
        this.audioButton = new UIButton(rightItemHeader.element, ['item__audio-button'], '', false);
        this.audioButton.element.style.backgroundImage = 'url(./play-button.svg)';
        this.isPlay = false;
        this.audio = new Audio();
        this.audioButton.onClickButton = ()=> { this.loadAudio()};

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
        

       
        this.addToDifficultButton.onClickButton = () => {
            const isExpired = this.authorization.JwtHasExpired();
            if(isExpired === false) {
                if(this.isDifficult === false) {
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
            if(isExpired === false) {
                this.openWindow();
            } else {
                window.location.reload();
            } 
        }
        this.learnButton.onClickButton = async() => {
            const isExpired = this.authorization.JwtHasExpired();
            if(isExpired === false) {
                if(this.isEasy === false){
                    this.makeWordDisabled();
                    if(this.isDifficult){
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
    async updateWord(){
        this.deleteRemoveButtonClass();
        this.isDifficult = false;
        const dataObj = this.getUserData();
        const userWord = {
            difficulty: 'easy',
            optional: {},
        }
        await updateUserWord(dataObj.userId, this.card._id, dataObj.token, userWord);
        if(this.element.id === 'group-7'){
            this.element.remove();
        }
    }
    removeFromEasy(){
       const params = this.getUserData();
       this.removeWordDisabled();
       deleteUserWord(params.userId, this.card._id, params.token);
       this.isEasy = false;
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
        this.isEasy = true;
    }
    addToDifficult(card: Word, arr: Word[]) {
        this.addRemoveButtonClass();
        const params = this.createWord('hard');
        createUserWord(params.dataObj.userId, card._id, params.dataObj.token, params.userWord);
        this.isDifficult = true;
    }
    async removeFromDifficult(card: Word) {
        this.deleteRemoveButtonClass();
        const params = this.getUserData();
        try {
            deleteUserWord(params.userId, this.card._id, params.token);
        } catch {
            alert('Войдите заново');
        }
        
        this.isDifficult = false;
        if(this.element.id === 'group-7'){
            this.element.remove();
        }
    }

    playAudio(i: number) {
        const audioObj = [ this.card.audio, this.card.audioExample, this.card.audioMeaning];
        this.audio.src = `${baseUrl}/${audioObj[i]}`;
        this.audio.play(); 
    }
    loadAudio(){
        let count = 0;
        if(this.isPlay === false) {
            this.audio = new Audio();
            this.playAudio(count);
           
            this.audio.addEventListener('ended', () => {
                if( count == 2) {
                    this.audio.pause();
                    this.isPlay = false;
                } else{
                    count++;
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
        this.learnButton.element.innerHTML = 'удалить из изученных'
        this.addToDifficultButton.setDisabled(true);
        this.statisticsButton.setDisabled(true);
    }
    removeWordDisabled() {
        this.element.style.opacity = '1.0';
        this.learnButton.element.innerHTML = 'изучено'
        this.addToDifficultButton.setDisabled(false);
        this.statisticsButton.setDisabled(false);
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
        // const modalWindow = document.querySelector('.item__statistics-window')!;
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