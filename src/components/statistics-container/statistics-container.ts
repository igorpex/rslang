/* eslint-disable @typescript-eslint/no-unused-vars */
import Component from '../../utils/component';
import './statistics-container.scss';
import Auth from '../auth/auth/auth';
import { authStorageKey } from '../../utils/config';
import {
  getUserStatisticsWithStatus,
  getUserWords,
} from '../../api/api';
import { Game, UserWord } from '../../interfaces';
import { dateMsToStrDate, getDateNowString } from '../../utils/dates';
// eslint-disable-next-line import/order
import Chart from 'chart.js/auto';

class StatisticsContainer extends Component {
  private shortTime: Component | undefined;

  private longTime: Component | undefined;

  private shortTimeGames: Component | undefined;

  private shortTimeWords: Component | undefined;

  private newWordTodaySprint: number | undefined;

  private newWordTodayAudioChallenge: number | undefined;

  private learnedTotalWordsByDays: [string, number] | [] | undefined;

  private newWordByDays: [string, number] | [] | undefined;

  private newWordsToday: number | undefined;

  private learnedWordsToday: number | undefined;

  private sprintSuccessPercentToday: number | undefined;

  private sprintMaxInARowToday: number | undefined;

  private audioChallengeSuccessPercentToday: number | undefined;

  private audioChallengeMaxInARowToday: number | undefined;

  private successPercentToday: number | undefined;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', ['statistics-container']);
  }

  async start() {
    const auth = new Auth();
    if (auth.JwtHasExpired()) {
      Component.add(
        this.element,
        'h2',
        ['statistics__login-message'],
        'Пожалуйста, войдите в учетную запись для просмотра статистики.',
      );
      return;
    }
    const userWords = await this.getUserWordsSimple();

    // график, отображающий количество новых слов за каждый день изучения
    // @ts-ignore
    this.newWordByDays = this.getNewWords(userWords);
    console.log('newWordByDays', this.newWordByDays);

    // увеличение общего количества изученных слов за весь период обучения по дням
    this.learnedTotalWordsByDays = this.getTotalLearnedWords(userWords);
    console.log('learnedTotalWordsByDays', this.learnedTotalWordsByDays);

    // новых слов за день в игре Спринт
    this.newWordTodaySprint = this.getNewWordToday(userWords, 'sprint') || 0;
    // console.log('newWordTodaySprint', this.newWordTodaySprint);

    // новых слов за день в игре Аудиовызов
    this.newWordTodayAudioChallenge = this.getNewWordToday(userWords, 'audioChallenge') || 0;
    // console.log('newWordTodayAudioChallenge', this.newWordTodayAudioChallenge);

    // новые слов за каждый день изучения
    this.newWordsToday = this.newWordTodaySprint + this.newWordTodayAudioChallenge;

    // изученных слов за день
    this.learnedWordsToday = this.getLearnedWordsToday(userWords) || 0;

    // сегодняшняя статистика по играм
    const sprintStatToday = await this.getGamesStatToday('sprint');
    console.log('sprintStatToday:', sprintStatToday);
    // Процент правильных ответов за сегодня в игре Спринт
    this.sprintSuccessPercentToday = sprintStatToday.successPercentToday;
    // Самая длинная серия правильных ответов за сегодня  в игре Спринт
    this.sprintMaxInARowToday = sprintStatToday.maxRightInARowToday;

    const audioChallStatToday = await this.getGamesStatToday('audioChallenge');
    // Процент правильных ответов за сегодня в игре АудиоВызов
    this.audioChallengeSuccessPercentToday = audioChallStatToday.successPercentToday;
    // Самая длинная серия правильных ответов за сегодня  в игре АудиоВызов
    this.audioChallengeMaxInARowToday = audioChallStatToday.maxRightInARowToday;
    // Процент правильных ответов за день
    const right = (sprintStatToday.successCounterToday + audioChallStatToday.successPercentToday);
    const wrong = (sprintStatToday.failureCounterToday + audioChallStatToday.failureCounterToday);
    this.successPercentToday = ((right + wrong) === 0)
      ? 0 : Math.round((right / (right + wrong)) * 100);

    this.buildPage();
  }

  getUserWordsSimple = async () => {
    const auth = new Auth();
    if (!auth.JwtHasExpired()) {
      const userAuthData = localStorage.getItem(authStorageKey);
      const { userId, token } = JSON.parse(userAuthData!);
      const userWords = await getUserWords(userId, token);
      console.log('userWords', userWords);
      return userWords;
    }
    return null;
  };

  // новые слов за каждый день изучения
  getNewWords = (userWords: UserWord[]) => {
    const newWordsPerDays = userWords
      .filter((userWord: UserWord) => userWord.optional.dateNew > 0)
      .map((userWord: UserWord) => {
        const date = new Date(userWord.optional.dateNew);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const day = date.getDate();// 1-31;
        return `${year}-${month + 1}-${day}`;
      })
      .reduce((acc: { [index: string]: number }, el: string) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(newWordsPerDays)
    // @ts-ignore
      .sort((a, b) => {
        if (a[0] < b[0]) { return -1; }
        if (a[0] > b[0]) { return 1; }
        return 1;
      });
  };

  // new words for today
  getNewWordToday = (userWords: UserWord[], game: Game) => {
    const todayStr = getDateNowString();
    console.log('todayStr:', todayStr);
    const newWordsPerDays = userWords
      .filter((userWord: UserWord) => (userWord.optional.dateNew > 0
          && userWord.optional.gameNew === game))
      .map((userWord: UserWord) => {
        const date = new Date(userWord.optional.dateNew);
        return dateMsToStrDate(date);
      })
      .reduce((acc: { [index: string]: number }, el: string) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});
    return newWordsPerDays[todayStr];
  };

  // увеличение общего количества изученных слов за весь период обучения по дням
  getTotalLearnedWords = (userWords: UserWord[]) => {
    const learnedWordsPerDaysObj = userWords
      .filter((userWord: UserWord) => userWord.optional.dateEasy > 0)
      .map((userWord: UserWord) => {
        const date = new Date(userWord.optional.dateEasy);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const day = date.getDate();// 1-31;
        return `${year}-${month + 1}-${day}`;
      })
      .reduce((acc: { [index: string]: number }, el: string) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});

    const learnedWordsPerDaysArr = Object.entries(learnedWordsPerDaysObj);
    // @ts-ignore
    // eslint-disable-next-line array-callback-return,consistent-return
    learnedWordsPerDaysArr.sort((a, b) => {
      if (a[0] < b[0]) { return -1; }
      if (a[0] > b[0]) { return 1; }
    });
    const totaLearnedWordsPerDaysArr: [string, number] | [] = [];
    learnedWordsPerDaysArr.forEach((element: [string, number], index) => {
      let sum = 0;
      if (index === 0) {
        [, sum] = element;
      } else {
        sum = totaLearnedWordsPerDaysArr[index - 1][1] + element[1];
      }
      const newElement = [element[0], sum];
      // @ts-ignore
      totaLearnedWordsPerDaysArr.push(newElement);
    });
    return totaLearnedWordsPerDaysArr;
  };

  getLearnedWordsToday = (userWords: UserWord[]) => {
    const todayStr = getDateNowString();
    const learnedWordsPerDaysObj = userWords
      .filter((userWord: UserWord) => userWord.optional.dateEasy > 0)
      .map((userWord: UserWord) => {
        const date = new Date(userWord.optional.dateEasy);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-11
        const day = date.getDate();// 1-31;
        return `${year}-${month + 1}-${day}`;
      })
      .reduce((acc: { [index: string]: number }, el: string) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});
    return learnedWordsPerDaysObj[todayStr];
  };

  async getGamesStatToday(game: Game) {
    const auth = new Auth();
    const emptyStat = {
      successPercentToday: 0,
      maxRightInARowToday: 0,
      successCounterToday: 0,
      failureCounterToday: 0,
    };
    if (!auth.JwtHasExpired()) {
      const userAuthData = localStorage.getItem(authStorageKey);
      const { userId, token } = JSON.parse(userAuthData!);

      const userStatisticsWStatus = await getUserStatisticsWithStatus({ id: userId, token });
      if (userStatisticsWStatus.status === 404) {
        console.log('no statistics for user yet');
        return emptyStat;
      }
      if (userStatisticsWStatus.status === 200) {
        const userStatistics = userStatisticsWStatus.data;
        const statisticsToday = userStatistics.optional[game].dateToday;
        const today = getDateNowString();
        if (statisticsToday !== today) {
          return emptyStat;
        }

        const { successCounterToday, failureCounterToday } = userStatistics.optional[game];
        if ((successCounterToday + failureCounterToday) === 0) {
          return emptyStat;
        }

        const successPercentToday = Math.round((successCounterToday
            / (successCounterToday + failureCounterToday)) * 100);
        const { maxRightInARowToday } = userStatistics.optional[game];
        return {
          successPercentToday, maxRightInARowToday, successCounterToday, failureCounterToday,
        };
      }
    }
    return emptyStat;
  }

  buildPage() {
    this.shortTime = new Component(this.element, 'div', ['statistics__short-time']);
    this.longTime = new Component(this.element, 'div', ['statistics__long-time']);

    this.shortTimeGames = new Component(this.shortTime.element, 'div', ['statistics__short-time-group', 'statistics__short-time-games']);
    this.shortTimeWords = new Component(this.shortTime.element, 'div', ['statistics__short-time-group', 'statistics__short-time-words']);
    const devidevLine1 = new Component(this.shortTimeGames.element, 'div', ['statistics__divided-line']);

    const games = ['audioChallenge', 'sprint'];
    // const gameNamesDict = { audioChallenge: 'Аудиовызов', sprint: 'Спринт' };
    const gameNames = ['Аудиовызов', 'Спринт'];
    const gameParamNames = [
      'Новых слов за день', 'Процент правильных ответов', 'Самая длинная серия правильных ответов'];
    const gameParamValues: { [index: string]: (number | undefined)[] } = {
      sprint: [
        this.newWordTodaySprint || 0,
        this.sprintSuccessPercentToday,
        this.sprintMaxInARowToday],
      audioChallenge: [
        this.newWordTodayAudioChallenge || 0,
        this.audioChallengeSuccessPercentToday,
        this.audioChallengeMaxInARowToday],
    };

    games.forEach((game, gameIndex) => {
      const gameStatCard = new Component(this.shortTimeGames!.element, 'div', ['statistics__game-stat-card']);
      Component.add(gameStatCard.element, 'h2', ['statistics__game-title'], `${gameNames[gameIndex]}`);
      gameParamNames.forEach((paramName, paramIndex) => {
        const gameStatItem = new Component(gameStatCard.element, 'div', ['statistics__game-stat-item']);
        Component.add(gameStatItem.element, 'div', ['statistics__game-stat-param-name'], `${paramName}`);
        Component.add(gameStatItem.element, 'div', ['statistics__game-stat-param-name'], `${gameParamValues[game][paramIndex]}`);
      });
    });

    Component.add(this.shortTimeWords.element, 'h2', ['statistics__word-title'], 'Статистика по словам');
    const wordStatParamNames = ['Новых слов за день', 'Изученных слов за день', 'Процент правильных ответов за день'];
    const wordsParamValues: (number | undefined)[] = [
      this.newWordsToday, this.learnedWordsToday, this.successPercentToday,
    ];

    wordStatParamNames.forEach((paramName, paramIndex) => {
      const gameStatItem = new Component(this.shortTimeWords!.element, 'div', ['statistics__word-stat-item']);
      Component.add(gameStatItem.element, 'div', ['statistics__word-stat-param-name'], `${paramName}`);
      Component.add(gameStatItem.element, 'div', ['statistics__word-stat-param-value'], `${wordsParamValues[paramIndex]}`);
    });

    const longStatCard1 = new Component(this.longTime.element, 'div', ['statistics__long-stat-card']);
    Component.add(longStatCard1.element, 'h2', ['statistics__long-title'], 'Новые слова по дням');

    const longStatCard2 = new Component(this.longTime.element, 'div', ['statistics__long-stat-card']);
    Component.add(longStatCard2.element, 'h2', ['statistics__long-title'], 'Общее кол-во изученных слов по дням');

    const newWordsByDayObjects = this.newWordByDays!.map((elem) => {
      // @ts-ignore
      const x = elem[0];
      // @ts-ignore
      const y = elem[1];
      return { x, y };
    });

    const learnedTotalWordsByDaysData = this.learnedTotalWordsByDays!.map((elem) => {
      // @ts-ignore
      const x = elem[0];
      // @ts-ignore
      const y = elem[1];
      return { x, y };
    });

    const myChart1 = new Component(longStatCard1.element, 'canvas', ['statistics__long-stat-chart']);

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const chart1 = new Chart(myChart1.element as HTMLCanvasElement, {
      type: 'line',
      data: {
        datasets: [
          {
            type: 'line',
            yAxisID: 'y1',
            label: 'Новых слов в день',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            data: newWordsByDayObjects,
          },
        ],
      },
      options: {
        animations: {
          tension: {
            duration: 5000,
            easing: 'linear',
            from: 0.5,
            to: 0,
            loop: true,
          },
        },
        scales: {
          x: {
            min: `${newWordsByDayObjects[0].x}`,
            bounds: 'ticks',
          },
        },
      },

    });

    const myChart2 = new Component(longStatCard2.element, 'canvas', ['statistics__long-stat-chart']);

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    const chart2 = new Chart(myChart2.element as HTMLCanvasElement, {
      type: 'line',
      data: {
        datasets: [
          {
            type: 'line',
            label: 'Всего изучено слов',
            borderColor: 'rgb(54, 162, 235)',
            order: 1,
            data: learnedTotalWordsByDaysData,
          },
        ],
      },
      options: {
        animations: {
          tension: {
            duration: 5000,
            easing: 'linear',
            from: 0.5,
            to: 0,
            loop: true,
          },
        },
        scales: {
          x: {
            min: `${newWordsByDayObjects[0].x}`,
          },
        },
      },

    });
  }
}

export default StatisticsContainer;
