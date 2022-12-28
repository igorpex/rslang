import Component from '../../utils/component';
import './footer.scss';

class Footer extends Component {

  private teamGhLink1: Component;

  private teamGhLink2: Component;

  private teamGhLink3: Component;

  private teamGhLinks: Component | undefined;

  private year: Component | undefined;

  private rsLogo: Component;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['footer', 'container']);

    this.rsLogo = new Component(this.element, 'a', ['footer__rs-logo']);
    this.rsLogo.element.setAttribute('href', 'https://rs.school/');

    // team container
    this.teamGhLinks = new Component(this.element, 'div', ['footer__team-gh-links']);

    this.teamGhLink1 = new Component(this.teamGhLinks.element, 'a', ['footer__team-gh-link'], 'Игорь Богданов');
    this.teamGhLink1.element.setAttribute('href', 'https://github.com/igorpex');
    this.teamGhLink2 = new Component(this.teamGhLinks.element, 'a', ['footer__team-gh-link'], 'Александра Пехота');
    this.teamGhLink2.element.setAttribute('href', 'https://github.com/takeAmoment');
    this.teamGhLink3 = new Component(this.teamGhLinks.element, 'a', ['footer__team-gh-link'], 'Владислав Королев');
    this.teamGhLink3.element.setAttribute('href', 'https://github.com/Vladislav122-kor');

    this.year = new Component(this.element, 'p', ['footer__year'], '2022');
  }
}

export default Footer;
