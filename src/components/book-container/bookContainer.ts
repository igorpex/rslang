import { getWords } from "../../api/api";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
import './bookContainer.scss'
import BookItem from "./bookItem";

class BookContainer extends Component{
    private title: Component;
    private mainContent: Component;
    private settingsPanel: Component;
    private cards: Word[];

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book-container']);
        this.drawWords(0, 1);
        this.cards = [];
        this.title = new Component(this.element, 'h2', ['book__title']);
        this.title.element.innerHTML = 'Book';
        this.settingsPanel = new Component (this.element, 'div', ['book__setting'],'Setting for book');
        this.mainContent = new Component(this.element, 'div', ['book__content']);
    }
    async drawWords(group: number, page: number){
        const cards = await getWords({group, page});
        this.cards = cards.items.map((card: Word) => {
            const item = new BookItem(this.mainContent.element, card);
            return item;
        })

    }

    private clear() {

    }
}

export default BookContainer;