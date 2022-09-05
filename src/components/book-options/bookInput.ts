import Component from '../../utils/component';
import ListItem from '../shared/list/list';
import UIInput from '../UI/input/input';
import downArrowImg from '../../assets/svg/down-arrow.svg';
import levelsIconImg from '../../assets/svg/levels-icon.svg';

class BookInput extends Component {
  // input: UIInput;
  updateGroup: (group: number) => void = () => {};

  private group = 0;

  amountOfLevel = 7;

  savedGroup: number;

  nameArray = ['Новичок', 'Ученик', 'Мыслитель', 'Кандидат', 'Мастер', 'Эксперт',
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
    levelIcon.element.style.backgroundImage = `url(${levelsIconImg})`;
    this.levelTitle = new Component(levelHeader.element, 'div', ['level__title']);
    this.getLocalStorage();
    // this.levelTitle.element.innerHTML = 'Новичок';
    const levelBtn = new Component(levelHeader.element, 'span', ['level__btn']);
    levelBtn.element.style.backgroundImage = `url(${downArrowImg})`;

    const levelList = new Component(this.element, 'ul', ['level__list']);
    for (let i = 0; i < this.nameArray.length; i++) {
      const listItem = new ListItem(levelList.element, i, this.nameArray[i]);
      if (this.group === i) {
        this.levelTitle.element.innerHTML = listItem.element.innerHTML;
      }
      listItem.onClickButton = (e) => {
        const target = e.target as HTMLElement;
        this.group = Number(target.getAttribute('data-group'));
        this.redrawPage(target);
      };
      listItem.element.setAttribute('data-group', `${i}`);
    }

    this.element.addEventListener('click', () => {
      levelList.element.classList.toggle('open');
    });
  }

  redrawPage(target: HTMLElement) {
    this.updateGroup(this.group);
    this.levelTitle.element.innerHTML = `${target.innerHTML}`;
  }

  getLocalStorage() {
    const data = localStorage.getItem('userData')!;
    if (data !== undefined && data !== null) {
      this.group = JSON.parse(data!).group;
    } else {
      this.group = 0;
    }
  }
}
export default BookInput;
