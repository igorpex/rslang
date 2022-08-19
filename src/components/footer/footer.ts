import Component from '../../utils/component';
import './footer.scss';

class Footer extends Component {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['footer']);
    const rsLogo = document.createElement('img');
    rsLogo.classList.add('footer-rs-logo');
    rsLogo.src = './logo-rs.svg';
    this.element.append(rsLogo);

    const gitHubLogo = document.createElement('img');
    gitHubLogo.classList.add('footer-gh-logo');
    gitHubLogo.src = './logo-gh.png';
    this.element.append(gitHubLogo);
  }
}

export default Footer;
