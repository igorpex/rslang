import { baseUrl } from "../../api/api";
import { GameObj, StatisticsObject } from "../../interfaces";
import Component from "../../utils/component";
import UIButton from "../UI/button/button";
import audioIcon from '../../assets/svg/audio-icon.svg';

class Game extends Component{
    gameObj: GameObj;
    nextBtn: UIButton;

    staticsObject: StatisticsObject;
    //wordObject
    //array of answers
    //audio
    // answer
    constructor(parentNode: HTMLElement, gameObj: GameObj){
        super(parentNode, 'div', ['game']);
        this.gameObj = gameObj;
        this.staticsObject = {
            word: this.gameObj.word!,
            isAnswerTrue: false,
        };
        const gameTitle = new Component(this.element, 'div', ['game__title'], 
                'Выберите правильный ответ');
        const gameContent = new Component(this.element, 'div', ['game__content']);
        
        const audioButton = new UIButton(gameContent.element, ['game__audio-button'], '');
        audioButton.element.style.backgroundImage = `url(${audioIcon})`;
        const audioTranslate = new Component(gameContent.element, 'p', ['game__translate'], `${gameObj.word!.word}`)
        const answersButton = new Component(gameContent.element, 'div', ['game__answers'] );
        const answers = gameObj.answers;
        const buttons: UIButton[] = [];

        this.playAudio();
        answers.forEach((answer, i) => {
            const button = new UIButton(answersButton.element, ['answer__btn'], `${i+1}. ${answer.wordTranslate}`);
            buttons.push(button);
            button.onClickButton = () => {
                if(gameObj.word!.wordTranslate === answer.wordTranslate){
                    button.element.style.background = "green";
                    this.staticsObject = {
                        word: this.gameObj.word!,
                        isAnswerTrue: true,
                    };

                } else {
                    button.element.style.background = "red";
                    this.staticsObject = {
                        word: this.gameObj.word!,
                        isAnswerTrue: false,
                    };
                    
                    buttons.forEach((button) => {
                        if(button.element.innerHTML === gameObj.word!.wordTranslate){
                            button.element.style.background = "green";
                        }
                    });
    

                }
                buttons.forEach((button) => {
                    button.setDisabled(true);
                })
            }
        });
    
        this.nextBtn = new UIButton(gameContent.element, ['next__game-btn'], ``);
        this.nextBtn.element.innerHTML = 'Не знаю';


        audioButton.onClickButton = () => {
            this.playAudio();
        }
    }
    playAudio(){
        const audio = new Audio();
        audio.src = `${baseUrl}/${this.gameObj.word!.audio}`;
        audio.play();
    }
}


export default Game;