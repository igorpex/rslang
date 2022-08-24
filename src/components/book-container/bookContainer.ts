import { getWords } from "../../api/api";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
import BookOptions from "../book-options/bookOptions";
import Pagination from "../shared/pagination/pagination";
import './bookContainer.scss'
import BookItem from "./bookItem";

class BookContainer extends Component{
    updatePage: (page: number) => void = () => {};
    updateGroup: (group: number) => void = () => {};

    private title: Component;
    private mainContent: Component;
    private bookOptions: BookOptions;
    pagination: Pagination;
    private cards: BookItem[];

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book-container']);
        // this.drawWords(this.group, this.page);
        this.cards = [];

        this.title = new Component(this.element, 'h2', ['book__title'], 'Book');
        this.bookOptions = new BookOptions(this.element, 'div', ['book__setting']);
        this.pagination  = new Pagination(this.element);
        this.mainContent = new Component(this.element, 'div', ['book__content']);

        this.pagination.updatePage = (page) => this.updatePage(page);
        this.bookOptions.updateGroup = (group) => this.updateGroup(group);
    }
    // async drawWords(group: number, page: number){
    //     const cards = await getWords({group, page});
    //     this.cards = cards.items.map((card: Word) => {
    //         const item = new BookItem(this.mainContent.element, card);
    //         return item;
    //     })

    // }

    private clear() {
        this.mainContent.element.innerHTML = '';
        this.cards = [];
    }

    addWords(cards: Word[]): void {
        this.clear();

        this.cards = cards.map((card: Word) => {
            const item = new BookItem(this.mainContent.element, card);
            return item;
        })
    }
}

export default BookContainer;