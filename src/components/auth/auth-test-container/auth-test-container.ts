import Component from '../../../utils/component';

import './auth-test-container.scss';
import UIButton from '../../UI/button/button';
import { signinUser } from '../../../api/api';
import { authStorageKey } from '../../../utils/config';
import Auth from '../auth/auth';

class AuthTestContainer extends Component {
  // private container: Component;

  private title: Component;

  private loginForm: Component | undefined;

  private usernameInput: Component | undefined;

  private passwordInput: Component | undefined;

  private loginButton: Component | undefined;

  private signUpLink: Component | undefined;

  private checkIsLoggedInButton: Component | undefined;

  private checkTokenExpired: Component | undefined;

  private logOutButton: Component | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['test__container']);
    this.loginForm = new Component(this.element, 'form', ['login__form']);
    this.title = new Component(this.loginForm.element, 'h2', ['login__title'], 'Вход в аккаунт');
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

    // this.loginButton = new Component(this.loginForm.element, 'button', ['login__login-button'], 'Log In');

    this.signUpLink = new Component(this.loginForm.element, 'a', ['login__signup-link'], 'Sign Up');
    this.signUpLink.element.setAttribute('href', './#signup');

    this.loginButton = new UIButton(this.loginForm.element, ['btn-small'], 'Log In');
    this.loginButton.element.setAttribute('type', 'submit');

    this.loginForm.element.addEventListener('submit', (e) => this.handleLogin(e));

    this.logOutButton = new UIButton(this.element, ['btn-small', 'logout-btn'], 'Log Out');
    this.loginButton!.element.style.display = 'block';
    this.logOutButton!.element.style.display = 'none';

    this.logOutButton.element.addEventListener('click', async () => {
      const auth = new Auth();
      auth.logOut();
      // this.loginButton!.element.style.display = 'block';
      // this.logOutButton!.element.style.display = 'none';
      window.location.reload();
      // alert('Logged Out');
    });

    // TEST buttons
    this.checkIsLoggedInButton = new UIButton(this.element, ['btn-small', 'check-login-btn'], 'Check if Log In');
    this.checkIsLoggedInButton.element.addEventListener('click', async () => {
      const auth = new Auth();
      const isLoggedIn = await auth.isLoggedIn();
      alert(`isLoggedIn? = ${isLoggedIn}`);
    });

    this.checkTokenExpired = new UIButton(this.element, ['btn-small', 'check-login-btn'], 'Check if Token Expired');
    this.checkTokenExpired.element.addEventListener('click', this.handleCheckJwt);

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
    console.log('login action. event:', e);
    // Get data from form
    const form = e.target as HTMLFormElement;
    // console.log('update form target:', e.target);
    const username = (form.querySelector('#login-username') as HTMLInputElement).value;
    if (username === '') return;
    const password = (form.querySelector('#login-password') as HTMLInputElement).value;
    if (password === '') return;
    const user = await signinUser({ email: username, password });
    if (user) {
      localStorage.setItem(authStorageKey, JSON.stringify(user));
      window.location.reload();
    } else {
      alert('error logging in');
    }
    console.log('user:', user);
  }

  private async handleCheckJwt(e: Event) {
    e.preventDefault();
    console.log('login action. event:', e);
    const auth = new Auth();
    alert(`Auth is expired: ${auth.JwtHasExpired()}`);
  }

  private clear() {
    // this.container.element.innerHTML = '';
    // this.content.element.innerHTML = '';
  }
}

export default AuthTestContainer;
