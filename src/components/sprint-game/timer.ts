import Component from '../../utils/component';

class Timer extends Component {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['sprint-game__timer'], '60');
    this.element.id = 'sprint-game-timer';
  }

  public start(finishCallback: Function) {
    // const countDownDate = new Date().getTime() + 61000;
    const countDownDate = new Date().getTime() + 10000;
    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById('sprint-game-timer')!.innerHTML = `${seconds}`;
      if (distance < 0) {
        clearInterval(x);
        document.getElementById('sprint-game-timer')!.innerHTML = 'GameOver';
        finishCallback();
      }
    }, 1000);
  }
}

export default Timer;
