import { getAllWords, getUserAggregatedWords, getUserAllAggregatedWords, getUserWordById, getUserWords, getWordById, getWords } from "../../api/api";
import Auth from "../../components/auth/auth/auth";
import BookContainer from "../../components/book-container/bookContainer";
import { DifficultWord, IDataObj, Word } from "../../interfaces";
import Component from "../../utils/component";
import { authStorageKey } from "../../utils/config";
import './book.scss';

class Book extends Component{
    private bookContainer: BookContainer;
    authorization: Auth;
    isAuth: boolean;
    filter = {
        hard: {"userWord.difficulty":"hard"},
        all: {"$or":[{"userWord.difficulty":"hard"},{"userWord":null}, {"userWord.difficulty":"easy"}]},
        easy: {"userWord.difficulty":"easy"},
    }
    page = 0;
    group = 0;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book']);
        this.isAuth = false;

        this.authorization = new Auth();
        this.checkAuthorization();
        
        this.bookContainer = new BookContainer(this.element);
        this.updateGroup();
        this.updatePage();
    }
    async checkAuthorization(){
        const data = await this.authorization.isLoggedIn();
        this.isCheck(data);
    }
    isCheck(data: boolean){
        if(data) {
            this.isAuth = true;
            this.bookContainer.isAuth = true;
            this.createForAuthUser();
        } else {
            this.isAuth = false;
            this.bookContainer.isAuth = false;
            this.createForAnonymous();
        }
    }
    async createForAuthUser() {
        this.bookContainer.clear();
        // const filter = {"$or":[{"userWord.difficulty":"easy"},{"userWord":null}]}
        const data = await this.getAggregatedWords(this.filter.all);
        const words = data[0].paginatedResults;
        await this.findIsDifficult();
        await this.findIsEasy();
        this.bookContainer.addWords(words, this.group, this.isAuth);
    }
    createForAnonymous() {
        this.getCards(this.group, this.page, this.isAuth);
    }
    private async getCards(group: number, page: number, isAuth: boolean) {
        const data = await getWords({group, page});
        if (data) {
            const cardsArr: Word[] = data.items;
            this.bookContainer.addWords(cardsArr, group, isAuth);
        }
    };
    private async getDifficultWords(group: number, page: number){
        if(this.isAuth){
            this.bookContainer.clear();
            const data = await this.getAggregatedWords(this.filter.hard);
            const words = data[0].paginatedResults;
            this.bookContainer.aggregatedHardWords = words;
            this.bookContainer.addWords(words, group, this.isAuth);
        }
    }
    async findIsDifficult() {
        const data = await this.getAggregatedWords(this.filter.hard);
        const words = data[0].paginatedResults;
        this.bookContainer.aggregatedHardWords = words;
    }
    async findIsEasy() {
        const data = await this.getAggregatedWords(this.filter.easy);
        const words = data[0].paginatedResults;
        console.log(data);
        this.bookContainer.aggregatedEasyWords = words;
    }
    async getAggregatedWords(filter: {}) {
        const dataObj = this.getUserData();
        const id = dataObj.userId;
        const token = dataObj.token;
        const wordsPerPage = 20;
        const page =  this.page;
        const group = this.group;
        const data = await getUserAggregatedWords({id, group, page, wordsPerPage, filter, token});
        return data;
    };
    getUserData(){
        const userAuthData = localStorage.getItem(authStorageKey);
        const userId = JSON.parse(userAuthData!).userId;
        const token = JSON.parse(userAuthData!).token;
        const dataObj: IDataObj = {
            userId: userId,
            token: token,
        };
        return dataObj;
    }
    updatePage(){
        this.bookContainer.updatePage = (page) => {
            this.page = page;
            if(this.isAuth) {
                this.createForAuthUser();
            } else {
                this.getCards(this.group, this.page, this.isAuth);
            }
        }
    }
    updateGroup(){
        this.bookContainer.updateGroup = (group) => {
            if(group < 6) {
                this.group = group;
                if(this.isAuth) {
                    this.createForAuthUser();
                } else {
                    this.getCards(this.group, this.page, this.isAuth);
                }
            } else if (group === 6) {
                if(this.isAuth)
                    this.getDifficultWords(group, this.page);
                } else {
                    this.bookContainer.mainContent.element.innerHTML = "Вы должны авторизоваться!"
                }
                
            }
    }
    
}

export default Book;