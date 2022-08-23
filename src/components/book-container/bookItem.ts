import { baseUrl } from "../../api/api";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
import UIButton from "../UI/button/button";
import './bookContainer.scss'

class BookItem extends Component{
    deleteCard: (cardId: number) => void = () => {};
    addToDifficult: (cardId: number) => void = () => {};

    private card: Word;
    private removeButton: UIButton;
    private addToDifficultButton: UIButton;

    constructor(parentNode: HTMLElement, card: Word){
        super(parentNode, 'div', ['book-item']);
        this.card = card;

        const leftItem = new Component(this.element, 'div', ['book-item__left']);
        const rightItem = new Component(this.element, 'div', ['book-item__right']);
        leftItem.element.style.backgroundImage = `url(${baseUrl}/${this.card.image})`;

        const cardName = new Component(rightItem.element, 'h3', ['item__name'], `${this.card.word[0].toLocaleUpperCase() + this.card.word.slice(1)}`);
        const cardTranscription = new Component(rightItem.element, 'p', ['item__transcription'], `${this.card.transcription}`);
        const cardTranslate = new Component(rightItem.element, 'p', ['item__translate'], `${this.card.wordTranslate}`);

        const audioButton = new UIButton(rightItem.element, ['item__audio-button'], '');
        audioButton.element.style.backgroundImage = 'url(./play-button.svg)';
        audioButton.onClickButton = ()=> { this.playAudio()};

        const textMeaning = document.createElement('p');
        textMeaning.innerHTML = this.card.textMeaning;
        rightItem.element.appendChild(textMeaning);

        const textMeaningTranslate = new Component(rightItem.element, 'p', ['item__text-meaning-translate'], `${this.card.textMeaningTranslate}`);
        
        const textExample = document.createElement('p');
        textExample.innerHTML = this.card.textExample;
        rightItem.element.appendChild(textExample);
        
        const textExampleTranslate = new Component(rightItem.element, 'p', ['item__text-example-translate'], `${this.card.textExampleTranslate}`);
        const buttonContainer = new Component(rightItem.element, 'div', ['item__buttons']);
        this.removeButton = new UIButton(buttonContainer.element, ['item__remove-button'], 'Удалить');
        this.addToDifficultButton = new UIButton(buttonContainer.element, ['item__add-button'], 'Добавить в сложные')
    
    }

    playAudio() {
        const audio = new Audio();
        audio.src = `${baseUrl}/${this.card.audio}`;
        console.log(audio);
        audio.play();
    }
}

export default BookItem;