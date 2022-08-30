import Component from "../../utils/component";
import UIInput from "../UI/input/input";

class BookInput extends Component{
    input: UIInput;
    updateGroup: (group: number) => void =() => {};
    private group = 0;
    amountOfLevel = 7;

    constructor(
        parentNode: HTMLElement,
        buttonText: string,
        styles: string[] = [],
    ) {
        super(parentNode, 'div', ['wrapper-input']);
        this.input = new UIInput(this.element, 'select', ['book-input']);
        const select = this.input.element as HTMLInputElement;

        for( let i = 1; i <= this.amountOfLevel; i++) {
          const option = new Component(select, 'option', ['input__option'], `Section ${i}`);
          const item = option.element as HTMLInputElement;
          item.value = `${i}`;
        }
        select.addEventListener('change', () => {
            this.updateGroup(Number(select.value) - 1);
          });
    }
} 
export default BookInput;