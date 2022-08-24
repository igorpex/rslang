import { Word } from "../../interfaces";
import Component from "../../utils/component";
import BookOptions from "../book-options/bookOptions";
import './bookContainer.scss'
import BookItem from "./bookItem";

class BookContainer extends Component{
    updatePage: (page: number) => void = () => {};
    updateGroup: (group: number) => void = () => {};
    startSprintGame: (cards: Word[]) => void = () => {};

    private title: Component;
    private mainContent: Component;
    private bookOptions: BookOptions;
    private cards: BookItem[];

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book-container']);

        this.cards = [];
        this.title = new Component(this.element, 'h2', ['book__title'], 'Book');
        this.bookOptions = new BookOptions(this.element, 'div', ['book__setting']);
        this.mainContent = new Component(this.element, 'div', ['book__content']);

        this.bookOptions.updatePage = (page) => this.updatePage(page);
        this.bookOptions.updateGroup = (group) => this.updateGroup(group);
 
    }

    private clear() {
        this.mainContent.element.innerHTML = '';
        this.cards = [];
    }

    addWords(cards: Word[], group: number): void {
        this.clear();

        this.cards = cards.map((card: Word) => {
            const item = new BookItem(this.mainContent.element, card)
            item.element.id = `group-${group + 1}`;
            return item;
        })
    }
}

export default BookContainer;