import { IDataObj, IDifficulWord, Word } from "../../interfaces";
import Component from "../../utils/component";
import { authStorageKey } from "../../utils/config"
import BookOptions from "../book-options/bookOptions";
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
    aggregatedHardWords: Word[];
    aggregatedEasyWords: Word[];
    private bookOptions: BookOptions;
    private cards: BookItem[];

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book-container']);
        this.isAuth = false;
        this.aggregatedHardWords = [];
        this.aggregatedEasyWords = [];
        // this.authorization = new Auth();
        // this.checkAuthorization();

        this.cards = [];
        this.title = new Component(this.element, 'h2', ['book__title'], 'Электронный учебник');
        this.bookOptions = new BookOptions(this.element, 'div', ['book__setting']);
        this.mainContent = new Component(this.element, 'div', ['book__content']);

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
            let isDifficult = this.isDifficult(card);
            let isEasy = this.isEasy(card);
            console.log(isDifficult);
            const item = new BookItem(this.mainContent.element, card, isDifficult, isEasy);
            if(isAuth){
                item.addButtons();
            }
            item.element.id = `group-${group + 1}`;
            return item;
        })
    }
    isDifficult(card: Word){
        const arr = this.aggregatedHardWords.filter((x) => x._id === card._id);
        console.log(arr);
        if(arr.length > 0){
            return true;
        } else {
            return false;
        } 
    }
    isEasy(card: Word){
        const arr = this.aggregatedEasyWords.filter((x) => x._id === card._id);
        if(arr.length > 0){
            return true;
        } else {
            return false;
        }
    }
    // async getUsersWord(){
    //     const dataObj = this.getUserData();
    //     const data = await getUserWords(dataObj.userId,  dataObj.token);
    //     return data;
    // }
    
    getUserData(){
        const userAuthData = localStorage.getItem(authStorageKey);
        if(!userAuthData){
            this.isAuth = false;
        }
        const userId = JSON.parse(userAuthData!).userId;
        const token = JSON.parse(userAuthData!).token;
        const dataObj: IDataObj = {
            userId: userId,
            token: token,
        };
        return dataObj;
    }

}

export default BookContainer;