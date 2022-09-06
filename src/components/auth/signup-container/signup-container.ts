import Component from '../../../utils/component';

import './signup-container.scss';
import UIButton from '../../UI/button/button';
import { createUser, signinUser } from '../../../api/api';
import { authStorageKey } from '../../../utils/config';
import Auth from '../auth/auth';
import { User } from '../../../interfaces';

class SignupContainer extends Component {
  private title: Component;

  private signupForm: Component | undefined;

  private usernameInput: Component | undefined;

  private passwordInput: Component | undefined;

  private signupButton: Component | undefined;

  private loginLink: Component | undefined;

  private logOutButton: Component | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['signup__container']);
    this.signupForm = new Component(this.element, 'form', ['signup__form']);
    this.title = new Component(this.signupForm.element, 'h2', ['signup__title'], 'Регистрация');
    this.usernameInput = new Component(this.signupForm.element, 'input', ['signup__username-input']);
    this.usernameInput.element.setAttribute('placeholder', 'email');
    this.usernameInput.element.setAttribute('type', 'text');
    this.usernameInput.element.setAttribute('name', 'username');
    this.usernameInput.element.setAttribute('id', 'signup-username');

    this.passwordInput = new Component(this.signupForm.element, 'input', ['signup__password-input']);
    this.passwordInput.element.setAttribute('placeholder', 'password');
    this.passwordInput.element.setAttribute('type', 'password');
    this.passwordInput.element.setAttribute('name', 'password');
    this.passwordInput.element.setAttribute('id', 'signup-password');

    this.signupButton = new UIButton(this.signupForm.element, ['signup__btn-small'], 'ЗАРЕГИСТРИРОВАТЬСЯ');
    this.signupButton.element.setAttribute('type', 'submit');

    this.signupForm.element.addEventListener('submit', (e) => this.handleSignup(e));

    this.loginLink = new Component(this.signupForm.element, 'a', ['signup__login-link'], 'Авторизация');
    this.loginLink.element.setAttribute('href', './#/login');

    this.logOutButton = new UIButton(this.element, ['btn-small', 'logout-btn'], 'Log Out');
    this.signupButton!.element.style.display = 'block';
    this.signupButton!.element.style.display = 'none';

    this.logOutButton.element.addEventListener('click', async () => {
      const auth = new Auth();
      auth.logOut();
      window.location.reload();
    });

    this.updateButtons();
  }

  public async updateButtons() {
    const auth = new Auth();
    const isLoggedIn = await auth.isLoggedIn();
    if (isLoggedIn) {
      this.signupForm!.element.style.display = 'none';
      this.signupForm!.element.style.display = 'none';
      this.logOutButton!.element.style.display = 'block';
    } else {
      this.signupForm!.element.style.display = 'flex';
      this.signupButton!.element.style.display = 'block';
      this.logOutButton!.element.style.display = 'none';
    }
  }

  private async loginUser(user: User) {
    try {
      const signedInUser = await signinUser(user);
      localStorage.setItem(authStorageKey, JSON.stringify(signedInUser));

      let next = '';
      const authRef = sessionStorage.getItem('authRef');
      if (authRef) {
        next = authRef;
      }
      const loc = window.location;
      loc.hash = next;
      const url = new URL(loc.href);
      window.location.replace(url);

      // window.location.reload();
    } catch {
      alert('error logging in');
    }
  }

  private async handleSignup(e: Event) {
    e.preventDefault();
    // Get data from form
    const form = e.target as HTMLFormElement;
    const username = (form.querySelector('#signup-username') as HTMLInputElement).value;
    if (username === '') return;
    const password = (form.querySelector('#signup-password') as HTMLInputElement).value;
    if (password === '') return;
    // Request api
    const signedUpUser = await createUser({ email: username, password });
    if (signedUpUser.statusCode) {
      console.log('statusCode:', signedUpUser.statusCode);
      console.log('res:', signedUpUser.res);
      const { statusCode } = signedUpUser;
      if (statusCode === 417) {
        alert('Такой пользователь уже существует, залогиньтесь');
      }
      if (statusCode === 422) {
        alert('Логин или пароль не соответствуют требованиям');
      }
      return;
    }
    console.log('signedUpUser ok:', signedUpUser);
    await this.loginUser({ email: username, password });
  }
}

export default SignupContainer;
