import Component from "../../utils/component";
import ListItem from "../shared/list/list";
import UIInput from "../UI/input/input";

class BookInput extends Component{
    // input: UIInput;
    updateGroup: (group: number) => void =() => {};
    private group = 0;
    amountOfLevel = 7;
    savedGroup: number;
    nameArray = ['Новичок', 'Ученик', 'Мыслитель',  'Кандидат',  'Мастер',  'Эксперт',
          'Сложные'];
    levelTitle: Component;
    constructor(
        parentNode: HTMLElement,
        buttonText: string,
        styles: string[] = [],
    ) {
        super(parentNode, 'div', ['wrapper-level']);

        this.savedGroup = 0;
        const levelHeader = new Component(this.element, 'div', ['level__header']);
        const levelIcon = new Component(levelHeader.element, 'span', ['level__icon']);
        levelIcon.element.style.backgroundImage = `url(./levels-icon.svg)`;
        this.levelTitle = new Component(levelHeader.element, 'div', ['level__title']);
        const data = this.getLocalStorage();
        this.levelTitle.element.innerHTML = 'Новичок';
        const levelBtn = new Component(levelHeader.element, 'span', ['level__btn']);
        levelBtn.element.style.backgroundImage = `url(./down-arrow.svg)`;

        const levelList = new Component(this.element, 'ul', ['level__list']);
        for(let i = 0; i < this.nameArray.length; i++) {
          const listItem = new ListItem(levelList.element, i, this.nameArray[i]);
          if(data.group === i){
            this.levelTitle.element.innerHTML = listItem.element.innerHTML;
          }
          listItem.onClickButton = (e) => {
            const target = e.target as HTMLElement;
            this.group = Number(target.getAttribute('data-group'));
            this.redrawPage(target);
          }
          listItem.element.setAttribute('data-group', `${i}`);
        }
        
        this.element.addEventListener('click', () => {
            levelList.element.classList.toggle('open');
          });
    }
    redrawPage(target: HTMLElement){
      this.updateGroup(this.group);
      this.levelTitle.element.innerHTML = `${target.innerHTML}`;
    }
    getLocalStorage() {
      const data = JSON.parse(localStorage.getItem('userData')!);
      const page = data.page;
      const group = data.group;
      return {page, group}
  }
} 
export default BookInput;