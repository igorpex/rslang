import Component from "../../utils/component";
import Pagination from "../shared/pagination/pagination";
import UIButton from "../UI/button/button";
import BookInput from "./bookInput";
import GameOptions from "./gameOptions";
import './options.scss';

class BookOptions extends Component{
    updatePage: (page: number) => void = () => {};
    updateGroup: (group: number) => void = () => {};
    
    private input: BookInput;
    private pagination: Pagination;
    private gameOptions: GameOptions;

    group = 0;

    constructor(
        parentNode: HTMLElement,
        buttonText: string,
        styles: string[] = [],
    ) {
        super(parentNode, 'div', ['book-options']);
        this.input = new BookInput(this.element, 'text', ['book-input']);
        this.pagination = new Pagination(this.element);
        this.gameOptions = new GameOptions(this.element);

        this.pagination.updatePage = (page) => this.updatePage(page);
        this.input.updateGroup = (group) => this.updateGroup(group);
    }
}

export default BookOptions;