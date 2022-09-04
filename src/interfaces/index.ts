export interface IRoute {
  name: string;
  component: () => void;
}

export interface User {
  name?: string;
  email: string;
  password: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
}

export interface Word {
  id: string,
  _id: string,
  userWord: UserWord,
  group: 0,
  page: 0,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

export type Difficulty = 'easy' | 'hard' | 'normal';
export type WordId = string;

export interface UserWord {
  difficulty: Difficulty;
  optional: WordOptional
}

export type Game = 'sprint' | 'audioChallenge';

export interface GameCounters {
  successCounter: number;
  failureCounter: number;
  [key: string]: number;
}

export interface WordOptional {
  dateNew: number;
  gameNew?: Game;
  dateEasy: number;
  rightInARow: number;
  sprint: GameCounters;
  audioChallenge: GameCounters;
  [key: string]: string | GameCounters | number | Game | undefined;
}

export interface UserAggregatedWordsParams {
  id: string;
  group?: number;
  page: number;
  wordsPerPage: number;
  filter: Object;
  token: string
}

export interface UserStatistics {
  learnedWords: number;
  optional: {}
}

export interface DifficultWord {
  wordId: string;
  difficulty: string;
  optional: {};
}

export interface UserSettings {
  wordsPerDay: number;
  optional: {}
}

export interface UserAuthData {
  message: string;
  name?: string;
  refreshToken: string;
  token: string;
  userId: string;
}

export interface UserSignUpResponse {
  id: string;
  name?: string;
  email: string;
}

export interface IDataObj {
  userId: string,
  token: string
}

export interface IDifficulWord {
  id: string;
  wordId: string;
  difficulty: string;
  optional: {};
}

export interface WordPromise {
  items: Word;
}

export interface SprintWord extends ShortWord {
  correctFlag?: number;
  proposedTranslate?: string;
}

export interface ShortWord {
  id: string,
  group: 0,
  page: 0,
  word: string,
  image?: string,
  audio: string,
  audioMeaning?: string,
  audioExample?: string,
  textMeaning?: string,
  textExample?: string,
  transcription?: string,
  wordTranslate: string,
  textMeaningTranslate?: string,
  textExampleTranslate?: string
}

export interface SprintCounts {
  totalPoints: number;
  pointsPerCorrectAnswer: number;
  rightInTheRow: number;
  maxRightInTheRow: number;
  dots: number;
  birds: number;
}
