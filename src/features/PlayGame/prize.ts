import { Board, Coordinates, GameStore } from '../../model';
import { COLS, initialPrize, ROWS } from '../../store/storeInstance';

const isPartOfSnakeBody = (
  newCoordinates: Coordinates,
  body: Array<Coordinates>
) =>
  body.findIndex(
    (value) => value.x === newCoordinates.x && value.y === newCoordinates.y
  ) > -1
    ? true
    : false;

const getRandomNumberFromTo = (from: number, to: number) => {
  return Math.round(Math.random() * (to - from) + from);
};
const getNewRandomCoordinates = () => {
  return {
    x: getRandomNumberFromTo(1, COLS - 2),
    y: getRandomNumberFromTo(1, ROWS - 2),
  };
};

export const getPrize = (body: Array<Coordinates>): Coordinates => {
  let newCoordinates: Coordinates = getNewRandomCoordinates();
  while (isPartOfSnakeBody(newCoordinates, body)) {
    newCoordinates = getNewRandomCoordinates();
  }
  return newCoordinates;
};

// Check if prize is not set
export const updatePrizeIfNotSet = (
  snake: Coordinates[],
  prize: Coordinates
): Coordinates => {
  if (prize.x === initialPrize.x && prize.y === initialPrize.y) {
    return getPrize(snake);
  }
  return prize;
};

export const updateStateCollidedWithPrize = (state: GameStore): GameStore => {
  const newPoints = state.points + 100;
  const newPrize = { ...initialPrize };
  return { ...state, points: newPoints, prize: newPrize };
};

export const drawPrize = (prize: Coordinates, board: Board) => {
  const newBoard = new Map(board);
  newBoard.set([prize.x, prize.y].join('|'), 'isPrize');
  return newBoard;
};
