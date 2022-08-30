import Component from '../../../utils/component';
import UIButton from '../../UI/button/button';
import SelectForm from '../select/select';

import './pagination.scss';

class Pagination extends Component {
  updatePage: (page: number) => void = () => {};

  private page = 0;
  limitOfPage = 30;

  // private titleBlock: SelectForm;
  private titleBlock: Component;

  nextButton: UIButton;

  prevButton: UIButton;

  doublePrevButton: UIButton;

  doubleNextButton: UIButton;
  nameArray: string[];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['pagination']);
    this.nameArray = [];
    for(let i = 1; i <= this.limitOfPage; i++){
      this.nameArray.push(`Страница ${i}`);
    }
    this.doublePrevButton = new UIButton(this.element, ['btn-double-prev'], '', true);
    this.doublePrevButton.element.style.backgroundImage = `url(./double-prev-arrows.svg)`;
    this.doublePrevButton.onClickButton = () => this.showPage('first');
    this.prevButton = new UIButton(this.element, ['btn-prev'], '', true);
    this.prevButton.element.style.backgroundImage = `url(./prev-arrow.svg)`;
    this.prevButton.onClickButton = () => this.switchPage('prev');

    // this.titleBlock = new Component(
    //   this.element,
    //   'h3',
    //   ['pagination__title'],
    //   `Страница ${this.page + 1}`,
    // );
    const wrapper = new Component(this.element, 'div', ['select__wrapper']);
    this.titleBlock = new SelectForm(wrapper.element, this.nameArray);

    this.nextButton = new UIButton(this.element, ['btn-next'], '', false);
    this.nextButton.element.style.backgroundImage = `url(./next-arrow.svg)`;
    this.nextButton.onClickButton = () => this.switchPage('next');

    this.doubleNextButton = new UIButton(this.element, ['btn-double-next'], '', false);
    this.doubleNextButton.element.style.backgroundImage = `url(./double-next-arrows.svg)`;
    this.doubleNextButton.onClickButton = () => this.showPage('last');
  }

  updateNextButton(page: number): void {
   // add totalCount and limit
    if (page >= this.limitOfPage - 1) {
      this.nextButton.setDisabled(true);
    } else {
      this.nextButton.setDisabled(false);
    }
  }
  updateDoubleNextButton(page: number): void {
    // add totalCount and limit
     if (page >= this.limitOfPage - 1) {
       this.doubleNextButton.setDisabled(true);
     } else {
       this.doubleNextButton.setDisabled(false);
     }
   }

  private updatePrevButton(): void {
    if (this.page === 0) {
      this.prevButton.setDisabled(true);
    } else {
      this.prevButton.setDisabled(false);
    }
  }
  private updateDoublePrevButton(): void {
    if (this.page === 0) {
      this.doublePrevButton.setDisabled(true);
    } else {
      this.doublePrevButton.setDisabled(false);
    }
  }

  private switchPage(type: string) {
    if (type === 'prev') {
      if (this.page >= 0) this.page -= 1;
    }

    if (type === 'next') this.page += 1;

    // this.title.element.innerHTML = `${this.page + 1} /30`;
    this.updatePage(this.page);
    this.updatePrevButton();
    this.updateDoublePrevButton();
    this.updateNextButton(this.page);
    this.updateDoubleNextButton(this.page);

  }
  private showPage(type: string){
    if (type === 'first') {
      if (this.page > 0) this.page = 0;
    }

    if (type === 'last') {
      if(this.page < this.limitOfPage - 1)
      this.page = this.limitOfPage - 1;
    }
    this.updatePage(this.page);
    this.updatePrevButton();
    this.updateDoublePrevButton();
    this.updateNextButton(this.page);
    this.updateDoubleNextButton(this.page);
  }
  makeButtonDissabled(){
    this.nextButton.setDisabled(true);
    this.doubleNextButton.setDisabled(true);
    this.prevButton.setDisabled(true);
    this.doublePrevButton.setDisabled(true);
  }
  removeButtonDissabled(){
    if(this.page > 0) {
      this.prevButton.setDisabled(false);
      this.doublePrevButton.setDisabled(false);
    }
    if(this.page < this.limitOfPage) {
      this.nextButton.setDisabled(false);
      this.doubleNextButton.setDisabled(false);
    }
   
  }
}

export default Pagination;
