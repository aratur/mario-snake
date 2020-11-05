/* eslint "no-param-reassign": 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import Coordinates from '../model/Coordinates';
import directions from '../model/Directions';
import { ColumnsAndRowsI } from './columnsAndRowsSlice';


const initialDirection: Coordinates = directions.Right;
const initialBody: Array<Coordinates> = [{ column: 3, row: 5 },];
const initialLevel = 6;
const initialNoOfLives = 3;
const initialSnakeLength = 4;
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
  if (state.lives === 0 || forceAll){
      state.lives = initialNoOfLives;
      state.points = initialPoints;
      state.snakeLength = initialSnakeLength;
      state.bricks = initialBricks(size);
      state.clearedBricks = initialClearedBricks;
  }
  state.body = initialBody;
  state.direction = initialDirection;
  state.previousDirection = initialDirection;
  state.prize = getPrize(initialBody, state.prize, size);
  state.wasKilled = initialWasKilled;
}

const isNotPartOfTheWall = (newCoordinates: Coordinates,
  size: ColumnsAndRowsI) =>
  newCoordinates.column < size.numberOfColumns
  && newCoordinates.column > 1
  && newCoordinates.row < size.numberOfRows
  && newCoordinates.row > 1;

const pivotCoordinates = (input: Coordinates, size: ColumnsAndRowsI): Coordinates => {
  if (size.numberOfColumns > size.numberOfRows)
    return { row: size.numberOfRows - input.column + 1, column: input.row };
  if (size.numberOfColumns < size.numberOfRows)
    return { row: input.column, column: size.numberOfColumns - input.row + 1 };
  return input;
};

const pivotCoordinatesArray = (input: Array<Coordinates>, size: ColumnsAndRowsI): Array<Coordinates> => {
  return input.map(value => pivotCoordinates(value, size));
}

const pivotArrayOfArrays = (input: Array<Array<boolean>>, size: ColumnsAndRowsI): Array<Array<boolean>> => {
  const output: Array<Array<boolean>> = initialBricks(size);
  console.log(input.length, output.length, input[0].length, output[0].length);
  return output
  .map(
    (col, col_index) => col
    .map(
      (_, row_index) => {
         if (size.numberOfColumns > size.numberOfRows){
           return input[size.numberOfRows - offset -row_index - 1][col_index];
         } else if (size.numberOfColumns < size.numberOfRows){
          return input[row_index][size.numberOfColumns - offset -1 - col_index]
        } else {
          return input[row_index][col_index];
        }
      }
      )
  );
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
    snakeOrientationChanged: (state, action: PayloadAction<ColumnsAndRowsI>) => {
      const size = action.payload;
      state.body = pivotCoordinatesArray(state.body, size);
      state.bricks = pivotArrayOfArrays(state.bricks, size);
      state.prize = pivotCoordinates(state.prize, size);
    },
    move: (state, action: PayloadAction<ColumnsAndRowsI>) => {
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
              state.bricks = initialBricks(size);
          } else {
            state.body.push(newHead);
            state.body.shift();
          }
      } else {
        state.snakeLength = state.lives > 0 ? state.body.length : initialSnakeLength;
        if (state.lives > 0) state.lives -= 1;
        state.wasKilled = true;
      }

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
export const getDirection = (state: RootState): string => {
  if (state.snake.direction === directions.Left) {
    return "Left";
  } else
  return "Right";
}
export const getNoOfLives = (state: RootState): number => state.snake.lives;
export const getSnakeBody = (state: RootState): Array<Coordinates> => state.snake.body;
export const getSnakeHead = (state: RootState): Coordinates => state.snake.body[state.snake.body.length-1];
export const getSnakeTail = (state: RootState): Coordinates => state.snake.body[0];
export const getLevel = (state: RootState): number => state.snake.level;
export const {
  changeDirection, levelUp, snakeReset, setWasKilled,
  levelDown, snakeResetAndResize,
  snakeOrientationChanged, snakeResize,
  move, } = snakeSlice.actions;
export default snakeSlice.reducer;
