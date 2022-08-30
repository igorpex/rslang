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
        console.log(this.isDifficult, isEasy);
        
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
        this.lernedWords.push(card);
        console.log(this.lernedWords);
    }
    addToDifficult(card: Word, arr: Word[]) {
        const params = this.createWord('hard');
        createUserWord(params.dataObj.userId, card._id, params.dataObj.token, params.userWord);
        // console.log(getUserWords(dataObj.userId, dataObj.token));
    }
    async removeFromDifficult(card: Word) {
        const params = this.createWord('easy');
       
       await updateUserWord(params.dataObj.userId, card._id, params.dataObj.token, params.userWord);
       deleteUserWord(params.dataObj.userId, this.card._id, params.dataObj.token);
       this.makeWordDisabled();
    //    console.log(getUserWords(dataObj.userId, dataObj.token));
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