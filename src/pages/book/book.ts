import { getAllWords, getWords } from "../../api/api";
import BookContainer from "../../components/book-container/bookContainer";
import { Word } from "../../interfaces";
import Component from "../../utils/component";
import './book.scss';

class Book extends Component{
    private bookContainer: BookContainer;
    page = 0;
    group = 0;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book']);
        this.getCards(this.group, this.page);

        this.bookContainer = new BookContainer(this.element);
        this.bookContainer.updatePage = (page) => {
            this.page = page;
            this.getCards(this.group, this.page);
        }
        this.bookContainer.updateGroup = (group) => {
            this.group = group;
            this.getCards(this.group, this.page);
        }
    }

    private async getCards(group: number, page: number) {
        const data = await getWords({group, page});
        if (data) {
            const cardsArr: Word[] = data.items;
            this.bookContainer.addWords(cardsArr, group);

            // this.bookContainer.pagination.updateNextButton(
            //     this.page,
            //     3600,
            //     20,
            // );
        }
        
    }
}

export default Book;