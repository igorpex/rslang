import {
  Game, UserStatistics, GameResult,
} from '../../../interfaces';
import Auth from '../../auth/auth/auth';
import { authStorageKey } from '../../../utils/config';
import {
  getUserStatisticsWithStatus, setUserStatistics,
} from '../../../api/api';
import { createEmptyUserStatistics } from '../emptyUserStatistics/emptyUserStatistics';
import { getDateNowString } from '../../../utils/dates';

function updateUserStatisticsObject(
  game: Game,
  gameResult: GameResult,
  userStatistics: UserStatistics,
) {
  const updatedUserStatistics = userStatistics;
  const today = getDateNowString();
  if (updatedUserStatistics.optional.dateToday === today) {
    updatedUserStatistics.optional[game].successCounterToday += gameResult.right;
    updatedUserStatistics.optional[game].failureCounterToday += gameResult.wrong;
    updatedUserStatistics.optional[game].maxRightInARowToday = Math.max(
      updatedUserStatistics.optional[game].maxRightInARowToday,
      gameResult.maxRightInARow,
    );
  } else {
    updatedUserStatistics.optional.dateToday = today;
    updatedUserStatistics.optional[game].successCounterToday = gameResult.right;
    updatedUserStatistics.optional[game].failureCounterToday = gameResult.wrong;
    updatedUserStatistics.optional[game].maxRightInARowToday = gameResult.maxRightInARow;
  }

  // Update Total Counters
  updatedUserStatistics.optional[game].successCounterToday += gameResult.right;
  updatedUserStatistics.optional[game].failureCounterToday += gameResult.wrong;
  updatedUserStatistics.optional[game].maxRightInARowTotal = Math.max(
    updatedUserStatistics.optional[game].maxRightInARowTotal,
    gameResult.maxRightInARow,
  );

  return updatedUserStatistics;
}

async function updateUserStatistics(game: Game, gameResult: GameResult) {
  const auth = new Auth();
  if (!auth.JwtHasExpired()) {
    const userAuthData = localStorage.getItem(authStorageKey);
    const { userId, token } = JSON.parse(userAuthData!);

    const userStatisticsWStatus = await getUserStatisticsWithStatus({ id: userId, token });

    if (userStatisticsWStatus.status === 404) {
      console.log('no statistics for user, creating one');
      const userStatistics = createEmptyUserStatistics();
      const updatedUserStatistics = updateUserStatisticsObject(game, gameResult, userStatistics);
      await setUserStatistics({ id: userId, statistics: updatedUserStatistics, token });
    } else if (userStatisticsWStatus.status === 200) {
      console.log('updating user statistics');
      const userStatistics = userStatisticsWStatus.data;
      delete userStatistics.id;
      const updatedUserStatistics = updateUserStatisticsObject(game, gameResult, userStatistics);
      await setUserStatistics({ id: userId, statistics: updatedUserStatistics, token });
    }
  }
}

export default updateUserStatistics;
