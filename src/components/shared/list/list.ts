import Component from "../../../utils/component";
import './list.scss';

class ListItem extends Component{
    onClickButton: (e: Event) => void = () => {};

    constructor(parentNode: HTMLElement, index: number, content: string) {
        super(parentNode, 'li', ['list__item'], content);
        this.element.addEventListener('click', (e) => this.onClickButton(e));
    }
}
export default ListItem;