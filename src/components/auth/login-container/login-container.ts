import Component from '../../../utils/component';

import './login-container.scss';
import UIButton from '../../UI/button/button';
import { signinUser, signinUserWithStatus } from '../../../api/api';
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
    this.title = new Component(this.loginForm.element, 'h2', ['login__title'], 'Вход в аккаунт');
    this.usernameInput = new Component(this.loginForm.element, 'input', ['login__username-input']);
    // this.usernameInput.element.setAttribute('value', '12@12.ru for user with stat');
    this.usernameInput.element.setAttribute('placeholder', 'email');
    this.usernameInput.element.setAttribute('type', 'text');
    this.usernameInput.element.setAttribute('name', 'username');
    this.usernameInput.element.setAttribute('id', 'login-username');

    this.passwordInput = new Component(this.loginForm.element, 'input', ['login__password-input']);
    // this.passwordInput.element.setAttribute('value', '12121212');
    this.passwordInput.element.setAttribute('placeholder', 'password');
    this.passwordInput.element.setAttribute('type', 'password');
    this.passwordInput.element.setAttribute('name', 'password');
    this.passwordInput.element.setAttribute('id', 'login-password');

    this.loginButton = new UIButton(this.loginForm.element, ['login__btn-small'], 'ВОЙТИ');
    this.loginButton.element.setAttribute('type', 'submit');

    this.loginForm.element.addEventListener('submit', (e) => this.handleLogin(e));

    this.signUpLink = new Component(this.loginForm.element, 'a', ['login__signup-link'], 'Регистрация');
    this.signUpLink.element.setAttribute('href', './#/signup');

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

    const userWStatus = await signinUserWithStatus({ email: username, password });
    if (userWStatus.status === 200) {
      const user = userWStatus.data;
      localStorage.setItem(authStorageKey, JSON.stringify(user));

      let next = '';
      const authRef = sessionStorage.getItem('authRef');
      if (authRef) {
        next = authRef;
      }
      const loc = window.location;
      loc.hash = next;
      const url = new URL(loc.href);
      window.location.replace(url);
    } else if (userWStatus.status === 403) {
      console.log('user:', userWStatus);
      alert('неверный пароль');
    } else if (userWStatus.status === 404) {
      console.log('user:', userWStatus);
      alert('пользователь не существует');
    } else {
      console.log('user:', userWStatus);
      alert('ошибка входа');
    }
    // console.log('user:', user);
  }
}

export default LoginContainer;
