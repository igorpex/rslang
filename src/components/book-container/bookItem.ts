import { baseUrl } from "../../api/api";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
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

    constructor(parentNode: HTMLElement, card: Word){
        super(parentNode, 'div', ['book-item']);
        this.card = card;
        this.lernedWords  = [];
        this.difficultWords = [];
        this.isDifficult = false;

        const mainBlock = new Component(this.element, 'div', ['main-block'])
        const leftItem = new Component(mainBlock.element, 'div', ['book-item__left']);
        const rightItem = new Component(mainBlock.element, 'div', ['book-item__right']);
        leftItem.element.style.backgroundImage = `url(${baseUrl}/${this.card.image})`;

        const leftItemHeader = new Component(rightItem.element, 'div', ['left__header']);
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
        const buttonContainer = new Component(this.element, 'div', ['item__buttons']);
        this.learnButton = new UIButton(buttonContainer.element, ['item__remove-button'], 'Изучено');
        this.addToDifficultButton = new UIButton(buttonContainer.element, ['item__add-button'], 'Добавить в сложные');
        this.statisticsButton = new UIButton(buttonContainer.element, ['item__statistics-button'], 'Статистика');
    
        const groupIcon = new Component(rightItem.element, 'span', ['item__icon', `group-${this.card.group + 1}`], `${this.card.group + 1}`);

        this.learnButton.onClickButton = () => {
            this.element.style.opacity = '0.6';
            this.learnButton.setDisabled(true);
            this.addToDifficultButton.setDisabled(true);
            this.addToLearned(this.card);
        };
        this.addToDifficultButton.onClickButton = () => {
            if(this.isDifficult === false) {
                this.addToDifficultButton.element.innerHTML = 'Удалить из сложных'
                this.isDifficult = true;
                this.addToDifficult(this.card, this.difficultWords);
            } else if (this.isDifficult === true) {
                this.addToDifficultButton.element.innerHTML = 'Добавить в сложные';
                this.isDifficult = false;
                this.removeFromDifficult(this.card);
            }
        };
        
    }
    addToLearned(card: Word) {
        this.lernedWords.push(card);
        console.log(this.lernedWords);
    }
    addToDifficult(card: Word, arr: Word[]) {
        arr.push(card);
        console.log(arr);
    }
    removeFromDifficult(card: Word) {
        const index = this.difficultWords.indexOf(card);
        this.difficultWords.splice(index, 1);
        console.log(this.difficultWords);
    }

    playAudio() {
        const audio = new Audio();
        audio.src = `${baseUrl}/${this.card.audio}`;
        audio.play();
    }
}

export default BookItem;