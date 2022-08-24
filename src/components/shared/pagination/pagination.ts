import Component from '../../../utils/component';
import UIButton from '../../UI/button/button';

import './pagination.scss';

class Pagination extends Component {
  updatePage: (page: number) => void = () => {};

  private page = 0;

  private title: Component;

  nextButton: UIButton;

  prevButton: UIButton;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['pagination']);

    this.prevButton = new UIButton(this.element, ['btn-prev'], 'Prev', true);
    this.prevButton.onClickButton = () => this.switchPage('prev');

    this.title = new Component(
      this.element,
      'h3',
      ['pagination__title'],
      `${this.page + 1} / 30`,
    );

    this.nextButton = new UIButton(this.element, ['btn-next'], 'Next');
    this.nextButton.onClickButton = () => this.switchPage('next');
  }

  updateNextButton(page: number, totalCount: number, limit: number): void {
   // add totalCount and limit
    if (page > 28) {
      this.nextButton.setDisabled(true);
    } else {
      this.nextButton.setDisabled(false);
    }
  }

  private updatePrevButton(): void {
    if (this.page === 0) {
      this.prevButton.setDisabled(true);
    } else {
      this.prevButton.setDisabled(false);
    }
  }

  private switchPage(type: string) {
    if (type === 'prev') {
      if (this.page >= 0) this.page -= 1;
    }

    if (type === 'next') this.page += 1;

    this.title.element.innerHTML = `${this.page + 1} /30`;
    this.updatePage(this.page);
    this.updatePrevButton();
  }
}

export default Pagination;
