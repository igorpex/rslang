import BookContainer from "../../components/book-container/bookContainer";
import Component from "../../utils/component";
import './book.scss';

class Book extends Component{
    private bookContainer: BookContainer;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['book']);

        this.bookContainer = new BookContainer(this.element);
    }
}

export default Book;