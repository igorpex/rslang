import { Difficulty, UserWord, WordOptional } from '../../../interfaces';

export class UserWordClass implements UserWord {
  public difficulty: Difficulty;

  public optional: WordOptional;

  constructor() {
    this.difficulty = 'normal';
    this.optional = {
      dateNew: 0,
      dateEasy: 0,
      rightInARow: 0,
      sprint: {
        successCounter: 0,
        failureCounter: 0,
      },
      audioChallenge: {
        successCounter: 0,
        failureCounter: 0,
      },
    };
  }
}

export function createEmptyUserWord() {
  const userWord = new UserWordClass();
  return userWord;
}
