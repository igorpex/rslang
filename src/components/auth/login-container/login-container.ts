import Component from '../../../utils/component';

import './login-container.scss';
import UIButton from '../../UI/button/button';
import { signinUser } from '../../../api/api';
import { authStorageKey } from '../../../utils/config';
import Auth from '../auth/auth';

class LoginContainer extends Component {
  private title: Component;

  private loginForm: Component | undefined;

  private usernameInput: Component | undefined;

  private passwordInput: Component | undefined;

  private loginButton: Component | undefined;

  private signUpLink: Component | undefined;

  private logOutButton: Component | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['login__container']);
    this.loginForm = new Component(this.element, 'form', ['login__form']);
    this.title = new Component(this.loginForm.element, 'h2', ['login__title'], 'Login');
    this.usernameInput = new Component(this.loginForm.element, 'input', ['login__username-input']);
    this.usernameInput.element.setAttribute('value', '12@12.ru');
    this.usernameInput.element.setAttribute('type', 'text');
    this.usernameInput.element.setAttribute('name', 'username');
    this.usernameInput.element.setAttribute('id', 'login-username');

    this.passwordInput = new Component(this.loginForm.element, 'input', ['login__password-input']);
    this.passwordInput.element.setAttribute('value', '12121212');
    this.passwordInput.element.setAttribute('type', 'password');
    this.passwordInput.element.setAttribute('name', 'password');
    this.passwordInput.element.setAttribute('id', 'login-password');

    this.signUpLink = new Component(this.loginForm.element, 'a', ['login__signup-link'], 'Sign Up');
    this.signUpLink.element.setAttribute('href', './#/signup');

    this.loginButton = new UIButton(this.loginForm.element, ['btn-small'], 'Log In');
    this.loginButton.element.setAttribute('type', 'submit');

    this.loginForm.element.addEventListener('submit', (e) => this.handleLogin(e));

    this.logOutButton = new UIButton(this.element, ['btn-small', 'logout-btn'], 'Log Out');
    this.loginButton!.element.style.display = 'block';
    this.logOutButton!.element.style.display = 'none';

    this.logOutButton.element.addEventListener('click', async () => {
      const auth = new Auth();
      auth.logOut();
      console.log('document.referrer:', document.referrer);
      window.location.reload();
    });

    this.updateButtons();
  }

  public async updateButtons() {
    const auth = new Auth();
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) {
      this.loginForm!.element.style.display = 'none';
      this.loginButton!.element.style.display = 'none';
      this.logOutButton!.element.style.display = 'block';
    } else {
      this.loginForm!.element.style.display = 'flex';
      this.loginButton!.element.style.display = 'block';
      this.logOutButton!.element.style.display = 'none';
    }
  }

  private async handleLogin(e: Event) {
    e.preventDefault();
    // Get data from form
    const form = e.target as HTMLFormElement;
    const username = (form.querySelector('#login-username') as HTMLInputElement).value;
    if (username === '') return;
    const password = (form.querySelector('#login-password') as HTMLInputElement).value;
    if (password === '') return;
    const user = await signinUser({ email: username, password });
    if (user) {
      localStorage.setItem(authStorageKey, JSON.stringify(user));
      const params = new URLSearchParams(document.location.search);
      const ref = params.get('ref');
      let next = '';
      if (ref) {
        next = ref.slice(1);
      }
      const loc = window.location;
      loc.hash = next;
      const url = new URL(loc.href);
      url.searchParams.delete('ref');
      window.location.replace(url);
    } else {
      alert('error logging in');
    }
    // console.log('user:', user);
  }
}

export default LoginContainer;
