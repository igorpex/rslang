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
  userWord: {
    difficulty: string,
    optional: {},
  }
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

export type WordId = string;
export interface UserWord {
  difficulty: string;
  optional?: {}
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

export interface DifficultWord{
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
