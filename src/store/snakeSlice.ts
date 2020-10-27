/* eslint "no-param-reassign": 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import Coordinates from '../model/Coordinates';
import directions from '../model/Directions';
import { ColumnsAndRowsI } from './columnsAndRowsSlice';


const initialDirection: Coordinates = directions.Right;
const initialBody: Array<Coordinates> = [
  { column: 3, row: 5 },
];
const initialLevel = 8;
const initialNoOfLives = 3;
const initialSnakeLength = 29;
const getRandomNumberFromTo = (from: number, to: number) => {
  return Math.round(Math.random() * (to - from) + from);
}
const getRandomRow = (numberOfRows: number) => getRandomNumberFromTo(2, numberOfRows-1);
const getRandomColumn = (numberOfColumns: number) => getRandomNumberFromTo(2, numberOfColumns-1);
const getNewCoordinates = (size: ColumnsAndRowsI) => {
  return {
    column: getRandomColumn(size.numberOfColumns),
    row: getRandomRow(size.numberOfRows),
  };
};
export const isPartOfSpace = (newCoordinates: Coordinates, body: Array<Coordinates>) =>
  body.findIndex(value => value.column === newCoordinates.column
    && value.row === newCoordinates.row) > -1 ? true : false;

const getPrize = (
  body: Array<Coordinates>,
  oldPrize: Coordinates,
  size: ColumnsAndRowsI) => {

  let newCoordinates: Coordinates = getNewCoordinates(size);
  while (isPartOfSpace(newCoordinates, body) ||
    (oldPrize.column === newCoordinates.column
    && oldPrize.row === newCoordinates.row)
  ) {
    newCoordinates = getNewCoordinates(size);
  }
  return newCoordinates;
};

const initialPrize: Coordinates = { column: 0, row: 0 };
const initialPoints: number = 0;
const initialBrics: Array<Coordinates> = [];
const initialBricksU = (size: ColumnsAndRowsI): Array<Array<boolean>> => {
  return Array(size.numberOfColumns - 2).fill(Array(size.numberOfRows - 2).fill(true));
};
const initialClearedBricks:number = 0;
const initialWasKilled: boolean = false;

const initialState = {
  body: initialBody,
  bricksU: initialBricksU({numberOfColumns: 2, numberOfRows: 2}),
  clearedBricks: initialClearedBricks,
  direction: initialDirection,
  previousDirection: initialDirection,
  level: initialLevel,
  prize: initialPrize,
  lives: initialNoOfLives,
  points: initialPoints,
  snakeLength: initialSnakeLength,
  bricks: initialBrics,
  wasKilled: initialWasKilled,
};
type SnakeState = typeof initialState;

const resetState = (state: SnakeState,
    size: ColumnsAndRowsI, forceAll: boolean) => {
  state.body = initialBody;
  state.direction = initialDirection;
  state.previousDirection = initialDirection;
  state.prize = getPrize(initialBody, state.prize, size);
  state.wasKilled = initialWasKilled;
  if (state.lives === 0 || forceAll){
      state.lives = initialNoOfLives;
      state.points = initialPoints;
      state.snakeLength = initialSnakeLength;
      state.bricks = initialBrics;
      state.bricksU = initialBricksU(size);
      state.clearedBricks = initialClearedBricks;
  }
}

const isNotPartOfTheWall = (newCoordinates: Coordinates,
  size: ColumnsAndRowsI) =>
  newCoordinates.column < size.numberOfColumns
  && newCoordinates.column > 1
  && newCoordinates.row < size.numberOfRows
  && newCoordinates.row > 1;

const pivotCoordinates = (input: Coordinates): Coordinates => {
  return { row: input.column, column: input.row };
};

const pivotCoordinatesArray = (input: Array<Coordinates>): Array<Coordinates> => {
  return input.map(value => pivotCoordinates(value));
}


let previousTime = 0;
const values: Array<number> = [];
const getAverage = () => Math.round(values.reduce((pv, cv) => pv+cv, 0)/values.length * 10 ) / 10;
const measurePerformance = (time: number) => {
  if (time - previousTime > 0){
    values.push(time - previousTime);
    previousTime = time;
    if (values.length > 10 ) values.shift();
    console.log(getAverage())
  }
}

const snakeSlice = createSlice({
  name: 'snake',
  initialState,
  reducers: {
    changeDirection: (state, action: PayloadAction<string>) => {
      if (['Left','Right','Up','Down'].includes(action.payload)) {
        const newDirection = directions[action.payload];
        const oldDirection = state.previousDirection;
        if (oldDirection !== newDirection
          && (oldDirection.column + newDirection.column !== 0
            || oldDirection.row + newDirection.row !== 0)) {
          state.direction = newDirection;
        }
      }
    },
    levelUp: (state) => {
      if (state.level < 10) {
        state.level += 1;
      }
    },
    levelDown: (state) => {
      if (state.level > 1) {
        state.level -= 1;
      }
    },
    snakeReset: (state, action: PayloadAction<ColumnsAndRowsI>) => {
      resetState(state, action.payload, false);
    },
    snakeResetAndResize: (state, action: PayloadAction<ColumnsAndRowsI>) => {
      resetState(state, action.payload, true);
    },
    snakeOrientationChanged: (state) => {
      state.previousDirection = pivotCoordinates(state.previousDirection);
      state.direction = pivotCoordinates(state.direction);
      state.body = pivotCoordinatesArray(state.body);
      state.bricks = pivotCoordinatesArray(state.bricks);
      state.prize = pivotCoordinates(state.prize);
    },
    move: (state, action: PayloadAction<ColumnsAndRowsI>) => {
      previousTime = Date.now();
      const size: ColumnsAndRowsI = action.payload;
      state.previousDirection = state.direction;

      const oldHead = state.body[state.body.length-1];
      const newHead = {
        column: oldHead.column + state.direction.column,
        row: oldHead.row + state.direction.row
      };
      if (isNotPartOfTheWall(newHead, size)
        && !isPartOfSpace(newHead, state.body)) {
          if (!isPartOfSpace(newHead, state.bricks)
            && state.bricksU[newHead.column-1][newHead.row-1] === true){
            state.points += 1;
            state.bricks.push(newHead);
            state.bricksU[newHead.column-1][newHead.row-1] = false;
            state.clearedBricks += 1;
          }

          if (state.body.length < state.snakeLength) {
            state.body.push(newHead);
          } else if (newHead.column === state.prize.column
            && newHead.row === state.prize.row ){
            state.points += 25;
            state.body.push(newHead);
            state.prize = getPrize(state.body, state.prize, size);
          } else if (state.bricks.length === (size.numberOfRows - 2) *
                                             (size.numberOfColumns - 2)
                     && state.clearedBricks === (size.numberOfRows - 2) *
                                                (size.numberOfColumns - 2)){
              state.wasKilled = true;
              state.body.push(newHead);
              state.body.shift();
          } else {
            state.body.push(newHead);
            state.body.shift();
          }
      } else {
        state.snakeLength = state.lives > 0 ? state.body.length : initialSnakeLength;
        if (state.lives > 0) state.lives -= 1;
        state.wasKilled = true;
      }

      measurePerformance(Date.now());
    },
    setWasKilled: (state, action: PayloadAction<boolean>) => {
      state.wasKilled = action.payload;
    },
  },
});

export const getWasKilled = (state: RootState) => state.snake.wasKilled;
export const getBricks = (state: RootState) => state.snake
  .bricksU
  .map(
    (col, col_index) => col
    .map(
      (row, row_index) => {
        if (!row) {
          return {column: col_index + 2, row: row_index + 2 };
        } else {
          return [];
        }
      }).flat()
  ).flat();
export const getNoOfPoints = (state: RootState) => state.snake.points;
export const getNoOfLives = (state: RootState) => state.snake.lives;
export const getSnakeHead = (state: RootState) => state.snake.body[state.snake.body.length-1];
export const getSnakeTail = (state: RootState) => state.snake.body[0];
export const getLevel = (state: RootState) => state.snake.level;
export const {
  changeDirection, levelUp, snakeReset, setWasKilled,
  levelDown, snakeResetAndResize,
  snakeOrientationChanged,
  move, } = snakeSlice.actions;
export default snakeSlice.reducer;
