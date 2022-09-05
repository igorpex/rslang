import Component from "../../../utils/component"
import UIInput from "../../UI/input/input";
import './sections.scss';

class Sections extends Component {
    upgrateGroup: (group: number) => void = () => {}

    select: Component;
    private group = 0;
    // nameOfArray = [''];

    constructor(parentNode: HTMLElement){
        super(parentNode, 'div',['content__select-block']);

        this.select = new Component(this.element, 'select', ['select']);
        const selectElement = this.select.element as HTMLInputElement;

        for(let i = 1; i < 7; i++) {
            const option = new Component(this.select.element, 'option', [`group-${i}`], `${i}`);
        }
        this.select.element.addEventListener('change', () => {
            console.log(selectElement.value);
            this.upgrateGroup(Number(selectElement.value));
        })
    }

}
export default Sections;