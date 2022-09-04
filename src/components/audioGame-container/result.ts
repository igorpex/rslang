import { StatisticsObject } from "../../interfaces";
import Component from "../../utils/component";
import audioIcon from '../../assets/svg/audio-speaker.svg';
import UIButton from "../UI/button/button";

class Result extends Component{

    trueList: Component;
    result: StatisticsObject[];
    falseList: Component;
    buttonsContainer: Component;

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

        this.buttonsContainer = new Component(this.element, 'div', ['audioChallenge-result__buttons']);
        const repeatButton = new Component(this.buttonsContainer.element, 'a', ['audioChallenge-repeat__button'], 'Играть еще');
        repeatButton.element.setAttribute('href', '#/games/audioChallenge');
        repeatButton.element.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.reload();
        });
        // const burger = document.querySelector('.header__burger');
        // burger?.addEventListener('click', () => {
        //     const params = new URLSearchParams(document.location.search);
        //     const ref = params.get('ref');
        //     let next = '';
        //     if (ref) {
        //         next = ref.slice(1);
        //     }
        //     const loc = window.location;
        //     loc.hash = next;
        //     const url = new URL(loc.href);
        //     url.searchParams.delete('ref');
        //     window.location.replace(url);
        // })

        this.checkPreviousPage();

        this.filterTrueAnswers();
        this.filterFalseAnswers();
    }
    checkPreviousPage(){
        const params = new URLSearchParams(document.location.search);
        const ref = params.get('ref');
        if(ref !== null) {
            console.log(ref);
            if(ref!.includes('ebook')) {
                const buttonsListGames = new Component(this.buttonsContainer.element, 'a', ['audioChallenge-return__button'], 'К СЛОВАРЮ');
                buttonsListGames.element.setAttribute('href', `#`);
                buttonsListGames.element.addEventListener('click', (e) => {
                e.preventDefault();
                let next = '';
                if (ref) {
                    next = ref.slice(1);
                }
                const loc = window.location;
                loc.hash = next;
                const url = new URL(loc.href);
                url.searchParams.delete('ref');
                window.location.replace(url);
                });
            } 
        } else {
            const buttonsListGames = new Component(this.buttonsContainer.element, 'a', ['audioChallenge-return__button'], 'К СПИСКУ ИГР');
            buttonsListGames.element.setAttribute('href', '#/games');
        }
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