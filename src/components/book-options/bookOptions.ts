import Component from "../../utils/component";
import UIInput from "../UI/input/input";
import BookInput from "./bookInput";

class BookOptions extends Component{
    updateGroup: (group: number) => void = () => {};
    group = 0;
    input: BookInput;

    constructor(
        parentNode: HTMLElement,
        buttonText: string,
        styles: string[] = [],
    ) {
        super(parentNode, 'div', ['wrapper-input']);
        this.input = new BookInput(this.element, 'text', ['book-input']);
        this.input.updateGroup = (group) => this.updateGroup(group);
    }
}

export default BookOptions;