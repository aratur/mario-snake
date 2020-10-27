/* eslint "no-param-reassign": 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import Coordinates from '../model/Coordinates';
import directions from '../model/Directions';
import { ColumnsAndRowsI } from './columnsAndRowsSlice';


const initialDirection: Coordinates = directions.Right;
const initialBody: Array<Coordinates> = [{ column: 3, row: 5 },];
const initialLevel = 8;
const initialNoOfLives = 3;
const initialSnakeLength = 29;
// Coordinates start from 1 and correspond to the gridSlice dimensions
// therefore the offset is needed for arrays: border (1) + index0 (1) = 2
const offset = 2;
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
const initialBricks = (
    size: ColumnsAndRowsI = {numberOfColumns: offset, numberOfRows: offset}
  ): Array<Array<boolean>> => {
  return Array(size.numberOfColumns - offset)
    .fill(Array(size.numberOfRows - offset)
    .fill(true));
};
const initialClearedBricks:number = 0;
const initialWasKilled: boolean = false;

const initialState = {
  body: initialBody,
  bricks: initialBricks(),
  clearedBricks: initialClearedBricks,
  direction: initialDirection,
  previousDirection: initialDirection,
  level: initialLevel,
  prize: initialPrize,
  lives: initialNoOfLives,
  points: initialPoints,
  snakeLength: initialSnakeLength,
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
      state.bricks = initialBricks(size);
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
    snakeResize: (state, action: PayloadAction<ColumnsAndRowsI>) =>{
      const size = action.payload;
      // Bricks is and arrray of arrays
      // initialized to an empty array or arrays
      const noOfBricksColumns = state.bricks.length;
      const noOfBricksRows = noOfBricksColumns > 0 ?
        state.bricks[0].length : 0;

      if (size.numberOfColumns >= noOfBricksColumns + offset
        && size.numberOfRows >= noOfBricksRows + offset){
        console.log("rozszerzanie cegielek");
        const newBricks: Array<Array<boolean>> = initialBricks(size);
        state.bricks = newBricks
        .map(
          (col, col_index) => col
          .map(
            (_, row_index) => {
              if (col_index < noOfBricksColumns
                && row_index < noOfBricksRows) {
                return state.bricks[col_index][row_index];
              } else {
                return newBricks[col_index][row_index];
              }
            })
        );
      }
    },
    snakeReset: (state, action: PayloadAction<ColumnsAndRowsI>) => {
      resetState(state, action.payload, false);
    },
    snakeResetAndResize: (state, action: PayloadAction<ColumnsAndRowsI>) => {
      console.log("forced reset snake")
      resetState(state, action.payload, true);
    },
    snakeOrientationChanged: (state) => {
      state.previousDirection = pivotCoordinates(state.previousDirection);
      state.direction = pivotCoordinates(state.direction);
      state.body = pivotCoordinatesArray(state.body);
      // state.bricks = pivotCoordinatesArray(state.bricks);
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
          if (state.bricks[newHead.column-offset][newHead.row-offset] === true){
            state.points += 1;
            state.bricks[newHead.column-offset][newHead.row-offset] = false;
            state.clearedBricks += 1;
          }

          if (state.body.length < state.snakeLength) {
            state.body.push(newHead);
          } else if (newHead.column === state.prize.column
            && newHead.row === state.prize.row ){
            state.points += 25;
            state.body.push(newHead);
            state.prize = getPrize(state.body, state.prize, size);
          } else if (state.clearedBricks === (size.numberOfRows - offset) *
                                                (size.numberOfColumns - offset)){
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

export const getWasKilled = (state: RootState): boolean => state.snake.wasKilled;
export const getBricks = (state: RootState): Array<Coordinates> => state.snake
  .bricks
  .map(
    (col, col_index) => col
    .map(
      (row, row_index) => {
        if (!row) {
          return {column: col_index + offset, row: row_index + offset };
        } else {
          return [];
        }
      }).flat()
  ).flat();
export const getNoOfPoints = (state: RootState): number => state.snake.points;
export const getNoOfLives = (state: RootState): number => state.snake.lives;
export const getSnakeHead = (state: RootState): Coordinates => state.snake.body[state.snake.body.length-1];
export const getSnakeTail = (state: RootState): Coordinates => state.snake.body[0];
export const getLevel = (state: RootState): number => state.snake.level;
export const {
  changeDirection, levelUp, snakeReset, setWasKilled,
  levelDown, snakeResetAndResize,
  snakeOrientationChanged, snakeResize,
  move, } = snakeSlice.actions;
export default snakeSlice.reducer;
