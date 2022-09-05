import {
  StatisticsOptional, UserStatistics,
} from '../../../interfaces';
import { getDateNowString } from '../../../utils/dates';

export class UserStatisticsClass implements UserStatistics {
  public learnedWords: number;

  public optional: StatisticsOptional;

  constructor() {
    this.learnedWords = 0;
    this.optional = {
      dateToday: getDateNowString(),
      sprint: {
        maxRightInARowToday: 0,
        successCounterToday: 0,
        failureCounterToday: 0,
        maxRightInARowTotal: 0,
        successCounterTotal: 0,
        failureCounterTotal: 0,
      },
      audioChallenge: {
        maxRightInARowToday: 0,
        successCounterToday: 0,
        failureCounterToday: 0,
        maxRightInARowTotal: 0,
        successCounterTotal: 0,
        failureCounterTotal: 0,
      },
    };
  }
}

export function createEmptyUserStatistics() {
  const userStatistics = new UserStatisticsClass();
  return userStatistics;
}
