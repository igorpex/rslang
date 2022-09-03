import { StatisticsObject } from "../../interfaces";
import Component from "../../utils/component";

class Result extends Component{

    trueList: Component;
    result: StatisticsObject[];
    falseList: Component;

    constructor(parentNode: HTMLElement, result: StatisticsObject[]){
        super(parentNode, 'div', ['result__container']);
        this.result = result;

        // const resultWindow = new Component(this.element, 'div', ['result__'])

        const trueTitle = new Component(this.element, 'p', ['true__title'], 'Правильные');
        this.trueList = new Component(this.element, 'ul', ['true__list'])
        this.filterTrueAnswers();
        const falseTitle = new Component(this.element, 'p', ['true__title'], 'Неправильные');
        this.falseList = new Component(this.element, 'ul', ['true__list']);

        this.filterTrueAnswers();
        this.filterFalseAnswers();
    }

    filterTrueAnswers() {

        const trueAnswers = this.result.filter((item: StatisticsObject) => item.isAnswerTrue === true);
        console.log(trueAnswers);
        for(let words in trueAnswers) {
            const listItem = new Component(this.trueList.element, 'li', ['list__item']);
            listItem.element.innerHTML = `${trueAnswers[words].word.word}`;
        }
    }
    filterFalseAnswers() {
    
        const falseAnswers = this.result.filter((item: StatisticsObject) => item.isAnswerTrue === false);
        for(let words in falseAnswers) {
            const listItem = new Component(this.falseList.element, 'li', ['list__item']);
            listItem.element.innerHTML = `${falseAnswers[words].word.word}`;
        }
    }
    clear() {
        this.element.innerHTML = ' ';
    }
}

export default Result;