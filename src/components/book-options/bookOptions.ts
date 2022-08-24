import Component from "../../utils/component";
import Pagination from "../shared/pagination/pagination";
import BookInput from "./bookInput";

class BookOptions extends Component{
    updatePage: (page: number) => void = () => {};
    updateGroup: (group: number) => void = () => {};
    
    private input: BookInput;
    private pagination: Pagination;

    group = 0;

    constructor(
        parentNode: HTMLElement,
        buttonText: string,
        styles: string[] = [],
    ) {
        super(parentNode, 'div', ['book-options']);
        this.input = new BookInput(this.element, 'text', ['book-input']);
        this.pagination = new Pagination(this.element);

        this.pagination.updatePage = (page) => this.updatePage(page);
        this.input.updateGroup = (group) => this.updateGroup(group);
    }
}

export default BookOptions;