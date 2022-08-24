import { Word } from "../../interfaces";
import Component from "../../utils/component";
import UIButton from "../UI/button/button";

class OptionButtons extends Component {
    startSprintGame: () => void= () => {};
    startAudioGame: () => void = () => {};
    openDictionary: () => void = () => {};
    
    constructor(parentNode: HTMLElement){
        super(parentNode, 'div', ['boook-options__buttons']);

        const sprintBtn = new UIButton(this.element, ['option-button', 'sprint-button'], '');
        sprintBtn.element.style.backgroundImage = `url(./sprint2.svg)`;

        const audioGameBtn = new UIButton(this.element, ['option-button', 'audio-game-button'], '');
        audioGameBtn.element.style.backgroundImage = `url(./audio-game2.svg)`;

        const dictionaryBtn = new UIButton(this.element, ['option-button', 'dictionary-button'], '');
        dictionaryBtn.element.style.backgroundImage = `url(./dictionary2.svg)`;

        sprintBtn.onClickButton = () => {
            this.startSprintGame();
            console.log('start');
        }
        audioGameBtn.onClickButton = () => this.startAudioGame();
        dictionaryBtn.onClickButton = () => this.openDictionary();

    }
}

export default OptionButtons;