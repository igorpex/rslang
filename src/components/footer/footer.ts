import Component from '../../utils/component';
import './footer.scss';

class Footer extends Component {
  private rsLogoBox: Component;
  private rsLogoImg: Component;
  private teamGhLink1: Component;
  private teamGhLink2: Component;
  private teamGhLink3: Component;

  private teamGhLinks: Component | undefined;

  private year: Component | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['footer']);

    this.rsLogoBox = new Component(this.element, 'div', ['footer__rs-logo-box']);

    // Using this.rsLogoBox.ELEMENT as parent, we insert rsLogoImg to rsLogoBox
    this.rsLogoImg = new Component(this.rsLogoBox.element, 'img', ['footer__rs-logo-img']);
    this.rsLogoImg.element.setAttribute('src', './rs_school_js.svg');

    this.teamGhLinks = new Component(this.element, 'div', ['footer__team-gh-links']);

    this.teamGhLink1 = new Component(this.teamGhLinks.element, 'a', ['footer__team-gh-link'], 'Alexandra');
    this.teamGhLink1.element.setAttribute('href', 'https://github.com/takeAmoment');
    this.teamGhLink2 = new Component(this.teamGhLinks.element, 'a', ['footer__team-gh-link'], 'Vladislav');
    this.teamGhLink2.element.setAttribute('href', 'https://github.com/Vladislav122-kor');
    this.teamGhLink3 = new Component(this.teamGhLinks.element, 'a', ['footer__team-gh-link'], 'Igor');
    this.teamGhLink3.element.setAttribute('href', 'https://github.com/igorpex');

    this.year = new Component(this.element, 'div', ['footer__year'], '2022');
  }
}

export default Footer;
