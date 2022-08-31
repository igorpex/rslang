import { IDataObj, IDifficulWord, Word } from "../../interfaces";
import Component from "../../utils/component";
import { authStorageKey } from "../../utils/config"
import BookOptions from "../book-options/bookOptions";
import UIButton from "../UI/button/button";
import './bookContainer.scss'
import BookItem from "./bookItem";

class BookContainer extends Component{
    updatePage: (page: number) => void = () => {};
    updateGroup: (group: number) => void = () => {};
    startSprintGame: (cards: Word[]) => void = () => {};

    // authorization: Auth;
    isAuth: boolean;
    private title: Component;
    mainContent: Component;
    bookOptions: BookOptions;
    private cards: BookItem[];

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book-container']);
        this.isAuth = false;
        // this.authorization = new Auth();
        // this.checkAuthorization();

        this.cards = [];
        this.title = new Component(this.element, 'h2', ['book__title'], 'Электронный учебник');
        this.bookOptions = new BookOptions(this.element, 'div', ['book__setting']);
        this.mainContent = new Component(this.element, 'div', ['book__content']);

        const overlay = new Component(this.element, 'div', ['overlay']);
        const modalWindow = new Component(overlay.element, 'div', ['modal-window']);
        const modalContainer = new Component(modalWindow.element, 'div', ['modal-window__container']);
        const closeBtn = new UIButton(modalWindow.element, ['modal__close-btn'], '', false);
        closeBtn.element.style.backgroundImage = `url(./cross.svg)`;
        closeBtn.onClickButton = () => {
            overlay.element.classList.remove('open');
            modalContainer.element.innerHTML = '';
        }
        overlay.element.addEventListener('click', () => {
            overlay.element.classList.remove('open');
            modalContainer.element.innerHTML = '';
        });

        this.bookOptions.updatePage = (page) => this.updatePage(page);
        this.bookOptions.updateGroup = (group) => this.updateGroup(group);
 
    }

    clear() {
        this.mainContent.element.innerHTML = '';
        this.cards = [];
    }

    async addWords(cards: Word[], group: number, isAuth: boolean) {
        this.clear();
        
        this.isAuth = isAuth;
        this.cards = cards.map( (card: Word) => {
            let isDifficult = false;
            let isEasy = false
            if(card.userWord !== undefined){
                if(card.userWord.difficulty === 'easy'){
                    isEasy = true;
                } else if(card.userWord.difficulty === 'hard'){
                    isDifficult = true;
                }
            }
            const item = new BookItem(this.mainContent.element, card, isDifficult, isEasy);
            if(isAuth){
                item.addButtons();
            }
            item.element.id = `group-${group + 1}`;
            return item;
        })
    }
    

}

export default BookContainer;