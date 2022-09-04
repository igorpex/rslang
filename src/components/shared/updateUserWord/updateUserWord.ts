import {
  Game, SprintWord, UserWord, Word,
} from '../../../interfaces';
import Auth from '../../auth/auth/auth';
import { authStorageKey } from '../../../utils/config';
import {
  createUserWord, getUserWordByIdWithStatus, updateUserWord,
} from '../../../api/api';
import { createEmptyUserWord } from '../emptyUserWord/emptyUserWord';

function updateUserWordObject(game: Game, result: 'right' | 'wrong', userWord: UserWord) {
  const updatedUserWord = userWord;
  // Create New status if game is not new;
  if (!updatedUserWord.optional.dateNew) {
    updatedUserWord.optional.dateNew = Date.now();
    updatedUserWord.optional.gameNew = game;
  }

  if (result === 'right') {
    // Update game success counter
    updatedUserWord.optional[game].successCounter += 1;

    // in case of correct answer - update it on the way to become learned(rightInARowToEasy)
    updatedUserWord.optional.rightInARow += 1;

    // Update learned status and date
    const { difficulty } = updatedUserWord;
    switch (difficulty) {
      case 'hard':
        if (updatedUserWord.optional.rightInARow >= 5) {
          updatedUserWord.difficulty = 'easy';
          updatedUserWord.optional.dateEasy = Date.now();
        }
        break;
      case 'normal' || null:
        if (updatedUserWord.optional.rightInARow >= 3) {
          updatedUserWord.difficulty = 'easy';
          updatedUserWord.optional.dateEasy = Date.now();
        }
        break;
      default:
        break;
    }
  } else if (result === 'wrong') {
    // Update game fail counter
    updatedUserWord.optional[game].failureCounter += 1;

    // reset in a Row counter)
    updatedUserWord.optional.rightInARow = 0;

    // Make it hard
    updatedUserWord.difficulty = 'hard';

    // Reset Learned date to 0, because it is not learned anymore
    updatedUserWord.optional.dateEasy = 0;
  }

  return updatedUserWord;
  // case if user word does not exist - А new userWord and POST to server
}

async function updateWordStatistics(game: Game, result: 'right' | 'wrong', word: SprintWord | Word) {
  const auth = new Auth();
  if (!auth.JwtHasExpired()) {
    const userAuthData = localStorage.getItem(authStorageKey);
    const { userId, token } = JSON.parse(userAuthData!);
    // case if user word does exist - when get curren user word info, update it and PUT to server
    const userWordWStatus = await getUserWordByIdWithStatus(userId, word.id, token);

    if (userWordWStatus.status === 404) {
      console.log('word is new, not in userWords');
      const newUserWord = createEmptyUserWord();
      const updatedUserWord = updateUserWordObject(game, result, newUserWord);
      await createUserWord(userId, word.id, token, updatedUserWord);
    } else if (userWordWStatus.status === 200) {
      const userWord = userWordWStatus.data;
      delete userWord.id;
      delete userWord.wordId;
      const updatedUserWord = updateUserWordObject(game, result, userWord);
      await updateUserWord(userId, word.id, token, updatedUserWord);
    } else {
      console.log('Error requesting user word');
    }
  }
}

export default updateWordStatistics;
