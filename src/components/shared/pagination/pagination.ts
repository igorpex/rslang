import Component from '../../../utils/component';
import UIButton from '../../UI/button/button';
import ListItem from '../list/list';

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

  wrapper: Component;
  selectTitle: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['pagination']);
  
    this.doublePrevButton = new UIButton(this.element, ['btn-double-prev'], '', true);
    this.doublePrevButton.element.style.backgroundImage = `url(./double-prev-arrows.svg)`;
    this.doublePrevButton.onClickButton = () => this.showPage('first');
    this.prevButton = new UIButton(this.element, ['btn-prev'], '', true);
    this.prevButton.element.style.backgroundImage = `url(./prev-arrow.svg)`;
    this.prevButton.onClickButton = () => this.switchPage('prev');

    
    this.wrapper = new Component(this.element, 'div', ['select__wrapper']);
    const wrapperHeader = new Component(this.wrapper.element, 'div', ['select__header']);
    const wrapperIcon = new Component(wrapperHeader.element, 'span', ['select__icon']);
    wrapperIcon.element.style.backgroundImage = `url(./file-icon.svg)`;
    this.selectTitle = new Component(wrapperHeader.element, 'p', ['select__title']);
    this.selectTitle.element.innerHTML = `Страница ${this.page + 1}`;
    const selectBtn = new Component(wrapperHeader.element, 'span', ['select__btn']);
    selectBtn.element.style.backgroundImage = `url(./down-arrow.svg)`;

    this.titleBlock = new Component(this.wrapper.element, 'ul', ['select__list']);

    /// Page
    for(let i = 1; i <= this.limitOfPage; i++){
      const selectItem = new ListItem(this.titleBlock.element, i, `Страница ${i}`);
      selectItem.onClickButton = (e) => {
        const target = e.target as HTMLElement;
        this.page = Number(target.getAttribute('data-page'));
        this.reDrawPage();
      }
      selectItem.element.setAttribute('data-page', `${i-1}`);
    }
    this.wrapper.element.addEventListener('click', () => {
      this.titleBlock.element.classList.toggle('open');
    });
    
    this.nextButton = new UIButton(this.element, ['btn-next'], '', false);
    this.nextButton.element.style.backgroundImage = `url(./next-arrow.svg)`;
    this.nextButton.onClickButton = () => this.switchPage('next');

    this.doubleNextButton = new UIButton(this.element, ['btn-double-next'], '', false);
    this.doubleNextButton.element.style.backgroundImage = `url(./double-next-arrows.svg)`;
    this.doubleNextButton.onClickButton = () => this.showPage('last');
    this.getLocalStorage();
  }
  getLocalStorage() {
    const data = localStorage.getItem('userData')!;
      if(data !== undefined && data !== null){
        this.page = JSON.parse(data!).page;
      } else {
        this.page = 0;
      }
  }
  updateNextButton(page: number): void {
    if (page >= this.limitOfPage - 1) {
      this.nextButton.setDisabled(true);
    } else {
      this.nextButton.setDisabled(false);
    }
  }
  updateDoubleNextButton(page: number): void {
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
    this.reDrawPage();
  }
  private showPage(type: string){
    if (type === 'first') {
      if (this.page > 0) this.page = 0;
    }

    if (type === 'last') {
      if(this.page < this.limitOfPage - 1)
      this.page = this.limitOfPage - 1;
    }
    this.reDrawPage();
  }
  reDrawPage() {
    this.updatePage(this.page);
    this.updatePrevButton();
    this.updateDoublePrevButton();
    this.updateNextButton(this.page);
    this.updateDoubleNextButton(this.page);
    this.selectTitle.element.innerHTML = `Страница ${this.page + 1}`;
  }
  makeButtonDissabled(){
    this.nextButton.setDisabled(true);
    this.doubleNextButton.setDisabled(true);
    this.prevButton.setDisabled(true);
    this.doublePrevButton.setDisabled(true);
    this.wrapper.element.classList.add('disabled');
    this.selectTitle.element.innerHTML = `Страница 1`;
    
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
    this.wrapper.element.classList.remove('disabled');
    
  }
}

export default Pagination;
