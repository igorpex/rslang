import Component from "../../../utils/component";
import UIInput from "../../UI/input/input";
import './select.scss';

class SelectForm extends UIInput{
    nameArray: string[];
    updateGroup: (group: number) => void =() => {};
    private group = 0;
    private page = 0;

    constructor(parentNode: HTMLElement, nameArray: string[]) {
        super(parentNode, 'select', ['select-form']);
        this.nameArray = nameArray;

        nameArray.forEach((name, i) => {
            const option = new Component(this.element, 'option', ['option__item'], `${name}`);
            const element = option.element as HTMLInputElement;
            element.value = `${i}`;
        })

        const select = this.element as HTMLInputElement;
        select.addEventListener('change', () => {
            this.updateGroup(Number(select.value) - 1);
          }); 
    }
}

export default SelectForm;