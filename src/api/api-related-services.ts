import { getUserAggregatedWords } from './api';
import { Word, WordPromise } from '../interfaces';
import { authStorageKey } from '../utils/config';

const filters = {
  hard: { 'userWord.difficulty': 'hard' },
  all: {
    $or: [{ 'userWord.difficulty': 'hard' }, { userWord: null }, { 'userWord.difficulty': 'easy' },
      { 'userWord.difficulty': 'normal' }],
  },
  easy: { 'userWord.difficulty': 'easy' },
  withoutEasy: {
    $or: [{ 'userWord.difficulty': 'hard' }, { userWord: null },
      { 'userWord.difficulty': 'normal' }],
  },
};

/**
 * Gets all user aggregated words from page 0 to N, for group M.
 * Group and page is taken from localStorage 'userData'
 * User is taken from local storage (authStorageKey = 'userAuthData')
 */
async function getUserWordsToNPages(wordsPerPage = 20) {
  const userData = localStorage.getItem('userData');
  const { group, page } = JSON.parse(userData!);
  const userAuthData = localStorage.getItem(authStorageKey);
  const { userId, token } = JSON.parse(userAuthData!);
  const pagesArr = Array.from(Array(page + 1).keys()).reverse().slice(0, 10);
  const filter = filters.all;
  const wordsPagesPromises = pagesArr.map((pageNum) => getUserAggregatedWords({
    id: userId, group, page: pageNum, wordsPerPage, filter, token,
  }));
  const wordsPagesSettledPromises = (await Promise.allSettled(wordsPagesPromises));
  const wordsPages = wordsPagesSettledPromises
    .filter(({ status }) => status === 'fulfilled')
    .map((fulfilledPromise) => (
      fulfilledPromise as unknown as PromiseFulfilledResult<WordPromise>).value)
  // @ts-ignore
    .map((data) => data[0].paginatedResults)
    .map((elem: Word) => {
      const newElem = JSON.parse(JSON.stringify(elem));
      // eslint-disable-next-line no-underscore-dangle
      newElem.id = elem._id;
      return newElem;
    });
  console.log('wordsPages:', wordsPages);
  const unfilteredWords = wordsPages.flat();
  return unfilteredWords;
}

export default getUserWordsToNPages;
