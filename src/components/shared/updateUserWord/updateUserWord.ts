import { SprintWord } from '../../../interfaces';
import Auth from '../../auth/auth/auth';
import { authStorageKey } from '../../../utils/config';
import { createUserWord, getUserWordById, updateUserWord } from '../../../api/api';

async function updateWordStatistics(game: 'sprint' | 'audioChallenge', result: 'right' | 'wrong', word: SprintWord) {
  const auth = new Auth();
  if (!auth.JwtHasExpired()) {
    const userAuthData = localStorage.getItem(authStorageKey);
    const { userId, token } = JSON.parse(userAuthData!);
    // case if user word does exist - when get curren user word info, update it and PUT to server
    try {
      const userWord = await getUserWordById(userId, word.id, token);
      const updatedUserWord = userWord;
      const { difficulty } = userWord;
      if (result === 'right') {
        // in case of correct answer - update it on the way to become learned(rightInARowToEasy)
        // eslint-disable-next-line max-len
        updatedUserWord.optional.gameStat[game].successCounter = updatedUserWord.optional.gameStat[game].successCounter ? updatedUserWord.optional.gameStat[game].successCounter + 1 : 1;
        switch (difficulty) {
          case 'hard':
            // eslint-disable-next-line max-len
            if (updatedUserWord.optional.easy && updatedUserWord.optional.easy.rightInARowToEasy >= 5) {
              updatedUserWord.difficulty = 'easy';
              updatedUserWord.optional.easy.rightInARowToEasy += 1;
            }
            break;
          case 'normal' || null:
            // eslint-disable-next-line max-len
            if (updatedUserWord.optional.easy && updatedUserWord.optional.easy.rightInARowToEasy >= 3) {
              updatedUserWord.difficulty = 'easy';
              updatedUserWord.optional.easy.rightInARowToEasy += 1;
            }
            break;
          case 'easy':
            // eslint-disable-next-line max-len
            if (updatedUserWord.optional.easy && updatedUserWord.optional.easy.rightInARowToEasy) {
              updatedUserWord.optional.easy.rightInARowToEasy += 1;
            }
            break;
          default:
            break;
        }
      } else {
        // in case of wrong answer make it hard and reset all the way for the word to become learned (easy)
        updatedUserWord.difficulty = 'hard';
        updatedUserWord.optional.easy = null;
        // eslint-disable-next-line max-len
        updatedUserWord.optional.gameStat[game].failCounter = updatedUserWord.optional.gameStat[game].failCounter ? updatedUserWord.optional.gameStat[game].failCounter + 1 : 1;
      }
      const updateUserWordResult = await updateUserWord(userId, word.id, token, updatedUserWord);
      console.log('updateUserWordResult:', updateUserWordResult);
    } catch { // case if user word does not exist - create new userWord and POST to server
      console.log('word is new, not in userWords');
      let userWord;
      if (result === 'right') {
        userWord = {
          difficulty: 'normal',
          optional: {
            new: {
              isNew: true,
              dateNew: Date.now(),
              gameNew: game,
            },
            easy: {
              dateEasy: null,
              rightInARowToEasy: 1,
            },
            gamesStat: {
              sprint: { successCounter: 0, failCounter: 0 },
              audioChallenge: { successCounter: 0, failCounter: 0 },
            },
          },
        };
        userWord.optional.gamesStat[game] = { successCounter: 1, failCounter: 0 };
      } else {
        userWord = {
          difficulty: 'hard',
          optional: {
            new: {
              isNew: true,
              dateNew: Date.now(),
              gameNew: game,
            },
            easy: {
              dateEasy: null,
              rightInARowToEasy: 0,
            },
            gamesStat: {
              sprint: { successCounter: 0, failCounter: 0 },
              audioChallenge: { successCounter: 0, failCounter: 0 },
            },
          },
        };
        userWord.optional.gamesStat[game] = { successCounter: 1, failCounter: 0 };
      }
      const createUserWordResult = await createUserWord(userId, word.id, token, userWord);
      console.log('createUserResult:', createUserWordResult);
    }
  }
}

export default updateWordStatistics;
