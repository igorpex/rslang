import { authStorageKey } from '../../../utils/config';
import { UserAuthData } from '../../../interfaces';

class Auth {
  private _userAuthData: UserAuthData | undefined | null;

  public logOut() {
    localStorage.removeItem(authStorageKey);
  }

  // public async refteshTokens() {
  //   const userAuthData = localStorage.getItem(authStorageKey);
  //   if (userAuthData === undefined) throw new Error('401');
  // }

  public parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
  }

  public JwtHasExpired() {
    const userAuthData = localStorage.getItem(authStorageKey);
    if (!userAuthData) { return true; }
    const { token } = JSON.parse(userAuthData);
    const parsedToken = this.parseJwt(token);
    if (parsedToken.exp < (Number(new Date()) / 1000)) {
      return true;
    } return false;
  }

  public async isLoggedIn() {
    return !this.JwtHasExpired();
    // const userAuthData = localStorage.getItem(authStorageKey);
    // if (userAuthData === undefined) return false;
    // try {
    //   await getUser(JSON.parse(userAuthData!).userId, JSON.parse(userAuthData!).token);
    //   return true;
    // } catch {
    //   return false;
    // }
  }
}

export default Auth;
