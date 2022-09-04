import { StatisticsObject } from "../../interfaces";
import Component from "../../utils/component";
import audioIcon from '../../assets/svg/audio-speaker.svg';
import UIButton from "../UI/button/button";

class Result extends Component{

    trueList: Component;
    result: StatisticsObject[];
    falseList: Component;

    constructor(parentNode: HTMLElement, result: StatisticsObject[]){
        super(parentNode, 'div', ['audioChallenge-result__container']);
        this.result = result;

        const resultContent = new Component(this.element, 'div', ['audioChallenge-result__content'])
        const resultTitle = new Component(resultContent.element, 'h2', ['audioChallenge-content__title']);
        resultTitle.element.innerHTML = 'Отличный результат!';
        const trueTitle = new Component(resultContent.element, 'p', ['true-title'], 'Правильныx ответов:');
        this.trueList = new Component(resultContent.element, 'ul', ['true-list'])
        const falseTitle = new Component(resultContent.element, 'p', ['false-title'], 'Неправильных ответов:');
        this.falseList = new Component(resultContent.element, 'ul', ['false-list']);

        const buttonsContainer = new Component(this.element, 'div', ['audioChallenge-result__buttons']);
        const repeatButton = new UIButton(buttonsContainer.element, ['repeat-button'], 'Играть еще');
        const returnButton = new UIButton(buttonsContainer.element, ['return-button'], 'К списку игр');

        this.filterTrueAnswers();
        this.filterFalseAnswers();
    }

    filterTrueAnswers() {

        const trueAnswers = this.result.filter((item: StatisticsObject) => item.isAnswerTrue === true);
        for(let words in trueAnswers) {
            const listItem = new Component(this.trueList.element, 'li', ['result-list__item']);
            const itemAudio = new UIButton(listItem.element, ['list__item-audio'], '');
            itemAudio.element.style.backgroundImage = `url(${audioIcon})`;
            const itemWord = new Component(listItem.element, 'span', ['list__item-word']);
            itemWord.element.innerHTML = `${trueAnswers[words].word.word} - ${trueAnswers[words].word.wordTranslate}`
        }
    }
    filterFalseAnswers() {
    
        const falseAnswers = this.result.filter((item: StatisticsObject) => item.isAnswerTrue === false);
        for(let words in falseAnswers) {
            const listItem = new Component(this.falseList.element, 'li', ['result-list__item']);
            const itemAudio = new UIButton(listItem.element, ['list__item-audio'], '');
            itemAudio.element.style.backgroundImage = `url(${audioIcon})`;
            const itemWord = new Component(listItem.element, 'span', ['list__item-word']);
            itemWord.element.innerHTML = `${falseAnswers[words].word.word} - ${falseAnswers[words].word.wordTranslate}`
        }
    }
    clear() {
        this.element.innerHTML = ' ';
    }
}

export default Result;