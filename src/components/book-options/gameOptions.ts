import { Word } from "../../interfaces";
import Component from "../../utils/component";
import UIButton from "../UI/button/button";

class GameOptions extends Component {
    startSprintGame: () => void= () => {};
    startAudioGame: () => void = () => {};
    openDictionary: () => void = () => {};
    
    constructor(parentNode: HTMLElement){
        super(parentNode, 'div', ['book-options__game']);

        this.element.innerHTML = 'Мини-игры';
        const gameList = new Component(this.element, 'ul', ['game__list']);
        gameList.element.classList.add('hidden');

        const sprintBtn = new Component(gameList.element, 'li', ['list__item'],  'Спринт');
        const audioGameBtn = new Component(gameList.element, 'li', ['list__item'], 'Аудивызов');

        this.element.addEventListener ('click', () => {
            gameList.element.classList.toggle('hidden');
        })
        sprintBtn.element.addEventListener('click', () => {
            gameList.element.classList.remove('hidden');
        });
        audioGameBtn.element.addEventListener('click', () => {
            gameList.element.classList.remove('hidden');
        });
        // sprintBtn.onClickButton = () => {
        //     this.startSprintGame();
        //     console.log('start');
        // }
        // audioGameBtn.onClickButton = () => this.startAudioGame();
        // dictionaryBtn.onClickButton = () => this.openDictionary();

    }
}

export default GameOptions;