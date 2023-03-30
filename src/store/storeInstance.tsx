import { Board, Coordinates, GameStore, GridItem } from '../model';
import createCustomStore from './createCustomStore';

export const COLS = 12;
export const ROWS = 14;

export const generateCoordinatesMap = (
  columns: number,
  rows: number
): Board => {
  const result = new Map<string, GridItem>();

  for (let x = 0; x < columns; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      const isLeftWall = x === 0;
      const isRightWall = x === columns - 1;
      const isBottomWall = y === 0;
      const isTopWall = y === rows - 1;

      if (isLeftWall || isRightWall || isBottomWall || isTopWall) {
        result.set([x, y].join('|'), 'isWall');
      } else {
        result.set([x, y].join('|'), 'isBrick');
      }
    }
  }

  return result;
};

export const initialBoard = generateCoordinatesMap(COLS, ROWS);

const getInitialSnake = (): Array<Coordinates> => {
  const result = new Array<Coordinates>();
  result.push({ x: 3, y: 3 });
  result.push({ x: 2, y: 3 });
  result.push({ x: 1, y: 3 });
  return result;
};
export const initialSnake = getInitialSnake();

initialSnake.forEach((segment, index) => {
  if (index === 0) initialBoard.set([segment.x, segment.y].join('|'), 'isHead');
  else initialBoard.set([segment.x, segment.y].join('|'), 'isTail');
});

export const initialPrize = { x: -1, y: -1 };

export const initialState: GameStore = {
  iteration: 0,
  direction: 'pause',
  position: initialSnake[0],
  snake: initialSnake,
  prize: initialPrize,
  points: 0,
  board: initialBoard,
  isGameOver: false,
};

// make a deep copy of non-primitive state values
export const deepCopyState = (state: GameStore): GameStore => {
  const { board, snake, prize, position, ...rest } = state;
  return {
    snake: [...snake],
    position: { ...position },
    board: new Map(board),
    prize: { ...prize },
    ...rest,
  };
};

export const getInitialState = () => deepCopyState(initialState);

export const { useCustomStore, StoreContextProvider } =
  createCustomStore<GameStore>(getInitialState());
