/* eslint "no-param-reassign": 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { numberOfRows, numberOfColumns } from '../model/ColumnsAndRows';
import Coordinates from '../model/Coordinates';
import directions from '../model/Directions';


const initialDirection: Coordinates = directions.Right;
const initialBody: Array<Coordinates> = [
  { column: 2, row: 2 },
];
const initialLevel = 5;
const initialNoOfLives = 3;
const initialSnakeLength = 5;
const getRandomNumberFromTo = (from: number, to: number) => {
  return Math.round(Math.random() * (to - from) + from);
}
const getRandomRow = () => getRandomNumberFromTo(2, numberOfRows-1);
const getRandomColumn = () => getRandomNumberFromTo(2, numberOfColumns-1);
const getNewCoordinates = () => {return { column: getRandomColumn(), row: getRandomRow()}};
export const isPartOfSpace = (newCoordinates: Coordinates, body: Array<Coordinates>) =>
  body.findIndex(value => value.column === newCoordinates.column
    && value.row === newCoordinates.row) > -1 ? true : false;

const getPrize = (body: Array<Coordinates>, oldPrize: Coordinates) => {
  let newCoordinates: Coordinates = getNewCoordinates();
  while (isPartOfSpace(newCoordinates, body) ||
    (oldPrize.column === newCoordinates.column
    && oldPrize.row === newCoordinates.row)
  ) {
    newCoordinates = getNewCoordinates();
  }
  return newCoordinates;
};

const initialPrize: Coordinates = { column: 0, row: 0 };
const initialPoints: number = 0;
const initialBrics: Array<Coordinates> = [];
const initialWasKilled: boolean = false;

const initialState = {
  body: initialBody,
  direction: initialDirection,
  previousDirection: initialDirection,
  level: initialLevel,
  previousPrize: initialPrize,
  prize: getPrize(initialBody, initialPrize),
  lives: initialNoOfLives,
  points: initialPoints,
  snakeLength: initialSnakeLength,
  bricks: initialBrics,
  wasKilled: initialWasKilled,
};
type SnakeState = typeof initialState;

const resetState = (state: SnakeState) => {
  state.body = initialBody;
  state.direction = initialDirection;
  state.previousDirection = initialDirection;
  state.prize = getPrize(initialBody, state.prize);
  state.wasKilled = initialWasKilled;
  if (state.lives === 0){
      state.lives = initialNoOfLives;
      state.points = initialPoints;
      state.snakeLength = initialSnakeLength;
      state.bricks = initialBrics;
  }
}

const isNotPartOfTheWall = (newCoordinates: Coordinates) =>
  newCoordinates.column < numberOfColumns
  && newCoordinates.column > 1
  && newCoordinates.row < numberOfRows
  && newCoordinates.row > 1

const snakeSlice = createSlice({
  name: 'snake',
  initialState,
  reducers: {
    changeDirection: (state, action: PayloadAction<string>) => {
        const oldDirection = state.previousDirection;
        const newDirection = directions[action.payload];
        if (oldDirection !== newDirection
          && (oldDirection.column + newDirection.column !== 0
            || oldDirection.row + newDirection.row !== 0)) {
          state.direction = newDirection;
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
    snakeReset: (state) => {
      resetState(state);
    },
    move: (state) => {
      state.previousDirection = state.direction;

      const oldHead = state.body[state.body.length-1];
      const newHead = {
        column: oldHead.column + state.direction.column,
        row: oldHead.row + state.direction.row
      };
      if (isNotPartOfTheWall(newHead)
        && !isPartOfSpace(newHead, state.body)) {
          if (!isPartOfSpace(newHead, state.bricks)){
            state.points += 1;
            state.bricks.push(newHead);
          }

          if (state.body.length < state.snakeLength) {
            state.body.push(newHead);
          } else if (newHead.column === state.prize.column
            && newHead.row === state.prize.row ){
            state.points += 25;
            state.body.push(newHead);
            state.prize = getPrize(state.body, state.prize);
          } else if (state.bricks.length === (numberOfRows - 2) * (numberOfColumns - 2)){
              state.bricks = initialBrics;
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
    },
    setWasKilled: (state, action: PayloadAction<boolean>) => {
      state.wasKilled = action.payload;
    },
    setPreviousPrize: (state, action: PayloadAction<Coordinates>) => {
      state.previousPrize = action.payload;
    }
  },
});

export const getWasKilled = (state: RootState) => state.snake.wasKilled;
export const getBricks = (state: RootState) => state.snake.bricks;
export const getNoOfPoints = (state: RootState) => state.snake.points;
export const getNoOfLives = (state: RootState) => state.snake.lives;
export const getSnakeHead = (state: RootState) => state.snake.body[state.snake.body.length-1];
export const getSnakeTail = (state: RootState) => state.snake.body[0];
export const getLevel = (state: RootState) => state.snake.level;
export const {
  changeDirection, levelUp, snakeReset,
  setPreviousPrize, setWasKilled,
  levelDown,
  move, } = snakeSlice.actions;
export default snakeSlice.reducer;
