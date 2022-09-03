import { Compilation } from "webpack";
import { getAllWords, getUserAggregatedWordsWithoutGroup, getWords, updateUser } from "../../api/api";
import { GameObj, StatisticsObject, Word } from "../../interfaces";
import Component from "../../utils/component";
import ListItem from "../shared/list/list";
import Sections from "../shared/section/section";
import UIButton from "../UI/button/button";
import "./audioGame.scss";
import Game from "./game";
import Result from "./result";
import arrowButton from '../../assets/svg/down-arrow.svg';
import levelsIcon from '../../assets/svg/levels-icon.svg';

class AudioGameContainer extends Component{
    updateGroup: (group: number) => void = () => {};

    private title: Component;

    private content: Component;

    select: Component;

    levelTitle: Component;

    private group = 1;

    private page = 0;

    private randomPage = 0;

    arrayOfPage: number[];

    gameObject: GameObj;

    count = 0;

    words: Word[];

    allAnswers: Word[];

    arrayOfName: string[];

    staticsObjects: StatisticsObject[];
    //statistics object

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['audioChallange__container']);

        this.words = [];
        this.arrayOfPage = [];
        this.allAnswers = [];
        this.gameObject = {
            word: null,
            answers: [],
        };
        this.staticsObjects = [];
        this.arrayOfName = ['Новичок', 'Ученик', 'Мыслитель', 'Кандидат', 'Мастер', 'Эксперт',
        'Сложные'];

        this.content = new Component(this.element, 'div', ['audioChallenge__content']);
        this.title = new Component(this.content.element, 'h2', ['audioChallenge__title'], 'Аудиовызов');
        const description = new Component(this.content.element, 'p', ['content__list']);
        description.element.innerHTML = '«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.'
        const list = new Component(this.content.element, 'ul', ['description__list']);
        const pointOne = new Component(list.element, 'li', ['audioChallenge-list__item']);
        pointOne.element.innerHTML = 'Используйте мышь, чтобы выбрать.'
        const pointTwo = new Component(list.element, 'li', ['audioChallenge-list__item']);
        pointTwo.element.innerHTML = 'Используйте цифровые клавиши от 1 до 5 для выбора ответа.'
        const pointThree = new Component(list.element, 'li', ['audioChallenge-list__item']);
        pointThree.element.innerHTML = 'Используйте пробел для повтроного звучания слова.'
        const pointFour = new Component(list.element, 'li', ['audioChallenge-list__item']);
        pointFour.element.innerHTML = 'Используйте клавишу Enter для подсказки или для перехода к следующему слову.';
        
        
        const options = new Component(this.content.element, 'div', ['audioChallenge__options']);
        const selectBlock = new Component(options.element, 'div', ['options__select-block']);
        const selectTitle = new Component(selectBlock.element, 'p', ['options__select-title'] );
        selectTitle.element.innerHTML = 'Выберите сложность:'

        //level-list
        this.select = new Component(selectBlock.element, 'div', ['audioChallenge__level']);
        const levelHeader = new Component(this.select.element, 'div', ['audioChallenge-level__header'])
        const levelIcon = new Component(levelHeader.element, 'span', ['audioChallenge-level__icon']);
        levelIcon.element.style.backgroundImage = `url(${levelsIcon})`;
        this.levelTitle = new Component(levelHeader.element, 'div', ['audioChallenge-level__title']);
        const levelBtn = new Component(levelHeader.element, 'span', ['audioChallenge-level__btn']);
        levelBtn.element.style.backgroundImage = `url(${arrowButton})`;

        const levelList = new Component(this.select.element, 'ul', ['audioChallenge-level__list']);
        for (let i = 0; i < this.arrayOfName.length; i++) {
            const listItem = new ListItem(levelList.element, i, this.arrayOfName[i]);
            if (this.group === i) {
                this.levelTitle.element.innerHTML = listItem.element.innerHTML;
            }
            listItem.onClickButton = (e) => {
                const target = e.target as HTMLElement;
                this.group = Number(target.getAttribute('data-group'));
                this.redrawPage(target);
            };
            listItem.element.setAttribute('data-group', `${i}`);
        }
        
        this.select.element.addEventListener('click', () => {
            levelList.element.classList.toggle('open');
        });

        const startButton = new UIButton(options.element, ['options__start-button'], 'Начать');
        
        startButton.onClickButton = () => {
            this.createGame()
        };

        
    // const params = new URLSearchParams(document.location.search);
    //   const ref = params.get('ref');
    //   let next = '';
    //   if (ref) {
    //     next = ref.slice(1);
    //   }
    //   const loc = window.location;
    //   loc.hash = next;
    //   const url = new URL(loc.href);
    //   url.searchParams.delete('ref');
    //   window.location.replace(url);
    }
    redrawPage(target: HTMLElement) {
        this.updateGroup(this.group);
        this.levelTitle.element.innerHTML = `${target.innerHTML}`;
      }
    async createGame(){
        const params = new URLSearchParams(document.location.search);
        const ref = params.get('ref');
        if(ref !== null) {
            if(ref!.includes('ebook')){
                const userData = localStorage.getItem ("userData");
                if(userData) {
                    this.group = JSON.parse(userData!).group;
                    this.page = JSON.parse(userData!).page;
                    this.createGamesArray();
                }
            }
        } else {
            this.createRandomArray();
        }
    }
    async createGamesArray() {

        //prepare array words hat we will use
        this.words = await this.getWords(this.group, this.page);

        // create array of answers
        this.createArrayOfPage();
        this.shuffleArray(this.arrayOfPage);
        this.arrayOfPage = this.arrayOfPage.slice(0, 3);
        const arrPromises = this.arrayOfPage.map((item: number) => {
            return this.getWords(this.group, item)
        });
        const arr: Word[]= await Promise.all(arrPromises);
        const answers = [];
        answers.push(this.words, arr.flat());
        this.allAnswers = answers.flat();
        // this.prepareGame();
        this.startGame();
        
    }
    createRandomArray(){
        this.page = this.getRandomPage(0, 29);
        this.createArrayOfPage();
        this.createGamesArray();

    }
    createArrayOfPage(){
        const amountOfPage = 30;
        for(let i = 0; i < 30; i++){
            this.arrayOfPage.push(i);
        }
        this.arrayOfPage = this.arrayOfPage.filter((page) => page !== this.page);
    }
    async getWords(group: number, page: number) {
        const words = await getWords({group, page});
        return words.items;
    }
    async startGame(){
        console.log(this.group, this.page);
        if(this.words.length >= 15) {
            this.words = this.shuffleArray(this.words);
            this.prepareGame();
            this.clear();

            const game = new Game(this.element, this.gameObject);
            game.nextBtn.element.addEventListener('click', () => {
                if(this.words.length >= 15) {
                    this.staticsObjects.push(game.staticsObject);
                    this.startGame();
                } else {
                    this.staticsObjects.push(game.staticsObject);
                    this.showResult(this.staticsObjects);
                }
            })
        } else {
            this.showResult(this.staticsObjects);
        }
        
    }
    prepareGame(){
        const wordObject = this.words[0];
        this.words = this.words.slice(1);

        let allAnswers = this.shuffleArray(this.allAnswers);
        allAnswers = allAnswers.filter((item) => item !== wordObject);
        const answers = [];
        answers.push(wordObject, allAnswers.slice(0, 4));
        const newAnswers = this.shuffleArray(answers).flat();
        this.gameObject = {
            word: wordObject,
            answers: newAnswers,
        }
    }
    showResult(result: StatisticsObject[]){
        this.element.innerHTML = '';
        const page = document.querySelector('.audio-page')!;
        const resultPage = new Result(this.element, result);
    }

    clear(){
        this.element.innerHTML = "";
    }
    getRandomPage = (firstPageNumber: number, amoutOfPages: 29) => {
        const max = amoutOfPages;
        const min = firstPageNumber
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    shuffleArray<T>(arr: T[]): T[]{
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }
}

export default AudioGameContainer;
