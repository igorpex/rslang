import Component from '../../utils/component';
import LoginContainer from '../../components/auth/login-container/login-container';

class Login extends Component {
  private loginContainer: LoginContainer;

  private teamContent: Component | undefined;
  // teamContainer = new TeamContainer(this.element);

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['login']);
    this.loginContainer = new LoginContainer(this.element);
  }
}

export default Login;
