import {
  UpdateUser, User, UserAggregatedWordsParams, UserSettings, UserStatistics, UserWord,
} from '../interfaces';

// const baseUrl = 'http://localhost:3000';
const baseUrl = 'https://rslang-be-igorpex.herokuapp.com';
const words = `${baseUrl}/words`;
const users = `${baseUrl}/users`;
const signin = `${baseUrl}/signin`;

/**
 * Gets a chunk of words.
  * @param {string} group - group number.
 * @param {string} page - page in the group;
 */
export const getWords = async ({ group, page }: { group: number, page: number }) => {
  const response = await fetch(`${words}?_group=${group}&_page=${page}`);
  return {
    items: await response.json(),
  };
};

/**
 * Get a word with assets by id.
 * @param {string} id - wordId;
 */
export const getWordById = async (id: string) => {
  const response = await fetch(`${words}/${id}`);
  return {
    items: await response.json(),
  };
};

/**
 * Gets all words in dictionary.
 */
export const getAllWords = async () => {
  const response = await fetch(words);
  return {
    items: await response.json(),
  };
};

/**
 * Creates a new user.
 * @param {object} user - user object {name?: string, email: string, password: string}
 */
export const createUser = async (user: User) => (await fetch(users, {
  method: 'POST',
  body: JSON.stringify(user),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

/**
 * Gets user.
 * returns user object {name?: string,  email: string, password: string}
 * @param {string} id - userId
 */
export const getUser = async (id: string) => (await fetch(`${users}/${id}`)).json();

/**
 * Updates a user.
 * @param {string} id - userId
 * @param {object} user - user object {name?: string,  email: string, password: string}
 * @param {string} token - user token.
 */
export const updateUser = async (id: string, token: string, user: UpdateUser) => (await fetch(`${users}/${id}`, {
  method: 'PUT',
  credentials: 'include',
  body: JSON.stringify(user),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();
// parameters for user update can be passed in any amount and combination (name, email, password).
// for example, name only or name and email, or email and password

/**
 * Deletes a user by id
 * @param {string} id - userId.
 * @param {string} token - user token.
 */
export const deleteUser = async (id: string) => (await fetch(`${users}${id}`, { method: 'DELETE' })).json();

/**
 * Logins a user and returns a JWT-tokens (token and refreshToken).
 * Return { "message": "string",
 * "token": "string", "refreshToken": "string","userId": "string", "name": "string"}
 * @param {string} id - userId.
 * @param {object} user - user object: {"email": "string","password": "string"};
 */
export const signinUser = async (id: string, user: User) => (await fetch(`${signin}`, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(user),
  headers: {
    'Content-Type': 'application/json',
  },
})).json();

// Get NewPair of tokens for the user. Requires refreshToken.
/**
 * Gets new user tokens using REFRESH token.
 * Return { "message": "string",
 * "token": "string", "refreshToken": "string","userId": "string", "name": "string"}
 * @param {string} id - userId.
 * @param {string} refreshToken - REFRESH token;
 */
export const refreshUserTokens = async (id: string, refreshToken: string) => (await fetch(`${users}/${id}/tokens`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${refreshToken}`,
  },
})).json();

/* Users/Words */
/**
 * Gets all user words.
 * @param {string} id - userId.
 * @param {string} token - user token.
 */
export const getUserWords = async (id: string, refreshToken: string) => (await fetch(`${users}/${id}/words`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${refreshToken}`,
  },
})).json();

/**
 * Create a user word by id.
 * @param {string} id - userId.
 * @param {string} wordId - wordId.
 * @param {object} userWord - userWord object. i.e. {"difficulty": "string","optional": {}}
 * @param {string} token - user token.
 */
export const createUserWord = async (id: string, wordId: string, token: string, userWord: UserWord) => (await fetch(`${users}/${id}/words/${wordId}`, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(userWord),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Gets a user word by id.
 * @param {string} id - userId.
 * @param {string} wordId - wordId.
 * @param {string} token - user token.
 */
const getUserWordById = async (id: string, wordId: string, token: string) => (await fetch(`${users}/${id}/words/${wordId}`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Updates a user word by id.
 * @param {string} id - userId.
 * @param {string} wordId - wordId.
 * @param {string} token - user token.
 */
export const updateUserWord = async (id: string, wordId: string, token: string, body: UserWord) => (await fetch(`${users}/${id}/words/${wordId}`, {
  method: 'PUT',
  credentials: 'include',
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Deletes user words by id.
 * @param {string} id - userId.
 * @param {string} wordId - wordId.
 * @param {string} token - user token.
 */
export const deleteUserWord = async (id: string, wordId: string, token: string) => (await fetch(`${users}/${id}/words/${wordId}`, {
  method: 'DELETE',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/* Users/AggregatedWords */

/**
 * Gets user aggregated words.
 * @param {string} id - userId.
 * @param {number} group - group(skip if you want result not depending on a group).
 * @param {number} page - page number.
 * @param {number} wordsPerPage - words per page.
 * @param {object} filter - Filter by aggreagted word fields.
 * It should be a stringified object which meet MongoDB Query object conditions.
 * Get all words that have difficulte="hard AND optional.key="value
 *
 * {"$and":[{"userWord.difficulty":"hard", "userWord.optional.key":"value"}]}
 *
 * Get all words that have difficulty equal="easy" OR do not have the linked userWord
 * {"$or":[{"userWord.difficulty":"easy"},{"userWord":null}]}
 *
 * Get all words that have BOTH difficulty equal="easy" AND optional.repeat=true,
 * OR do not have the linked userWord
 * {"$or":[{"$and":[{"userWord.difficulty":"easy", "userWord.optional.repeat":true}]},
 * {"userWord":null}]}.
 * @param {string} token - user token.
 */
export const getUserAggregatedWords = async ({
  id, group, page, wordsPerPage, filter, token,
}: UserAggregatedWordsParams) => (await fetch(`${users}/${id}/aggregatedWords?group=${group}&page=${page}&wordsPerPage=${wordsPerPage}&filter=${encodeURIComponent(JSON.stringify(filter))}`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Gets all user aggregated words.
 * @param {string} id - userId.
 * @param {string} token - user token.
 */
export const getUserAllAggregatedWords = async ({
  id, token,
}: { id: string, token: string }) => (await fetch(`${users}/${id}/aggregatedWords`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Get a user aggregated word by id.
 * @param {string} id - userId.
 * @param {string} wordId - wordId.
 * @param {string} token - user token.
 */
export const getUserAggregatedWordById = async ({
  id, wordId, token,
}: { id: string, wordId: string, token: string }) => (await fetch(`${users}/${id}/aggregatedWords/${wordId}`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/* Users/Statistic */

/**
 * Gets statistics.
 * Returns statistics object: {learnedWords: number, optional: {}}
 * @param {string} id - userId.
 * @param {string} token - user token.
 */
export const getUserStatistics = async ({
  id, token,
}: { id: string, token: string }) => (await fetch(`${users}/${id}/statistics`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Sets new statistics for user.
 * Body example {
 *   "learnedWords": 0,
 *   "optional": {}
 * }
 * @param {string} id - userId.
 * @param {object} statistics - user statistics, i.e. {"learnedWords": 0,"optional": {}}
 * @param {string} token - user token,
 * }.
 *
 */
export const setUserStatistics = async ({
  id, statistics, token,
}: { id: string, statistics: UserStatistics, token: string }) => (await fetch(`${users}/${id}/statistics`, {
  method: 'PUT',
  credentials: 'include',
  body: JSON.stringify(statistics),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/* Users/Settings */

/**
 * Gets user settings.
 * Returns {
 *   "learnedWords": 0,
 *   "optional": {}
 * }
 * @param {string} id - userId.
 * @param {string} token - user token.
 */
export const getUserSettings = async ({
  id, token,
}: { id: string, token: string }) => (await fetch(`${users}/${id}/settings`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();

/**
 * Sets user settings.
 * Body example {"wordsPerDay": 0,"optional": {}}
 * @param {string} id - userId.
 * @param {object} settings - user settings, i.e. {"wordsPerDay": 0,"optional": {}}.
 * @param {string} token - user token.
 * }.
 *
 */
export const setUserSettings = async ({
  id, settings, token,
}: { id: string, settings: UserSettings, token: string }) => (await fetch(`${users}/${id}/settings`, {
  method: 'PUT',
  credentials: 'include',
  body: JSON.stringify(settings),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})).json();
