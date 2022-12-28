//import { Word } from '../../interfaces';
import Component from '../../utils/component';
//import UIButton from '../UI/button/button';

class SearchOptions extends Component {

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['book-options__search']);

    const searchInput = new Component(this.element, 'input', ['book-options__search-input']);
    const crossIcon = new Component(this.element, 'div', ['book-options__search-cross']);
  }
}

export default SearchOptions;
