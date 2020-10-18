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
const initialLevel = 4;
const initialIsRunning = false;
const initialIsRestarting = true;
const initialNoOfLives = 3;
const initialSnakeLength = 15;
const getRandomNumberFromTo = (from: number, to: number) => {
  return Math.round(Math.random() * (to - from) + from);
}
const getRandomRow = () => getRandomNumberFromTo(2, numberOfRows-1);
const getRandomColumn = () => getRandomNumberFromTo(2, numberOfColumns-1);
const getNewCoordinates = () => {return { column: getRandomColumn(), row: getRandomRow()}};
const isPartOfTheBody = (newCoordinates: Coordinates, body: Array<Coordinates>) =>
  body.findIndex(value => value.column === newCoordinates.column
    && value.row === newCoordinates.row) > -1 ? true : false;

const getPrize = (body: Array<Coordinates>) => {
  let newCoordinates: Coordinates = getNewCoordinates();
  while (isPartOfTheBody(newCoordinates, body)) {
    newCoordinates = getNewCoordinates();
  }
  console.log(newCoordinates);
  return newCoordinates;
};

const initialState = {
  body: initialBody,
  direction: initialDirection,
  previousDirection: initialDirection,
  level: initialLevel,
  isRunning: initialIsRunning,
  isRestarting: initialIsRestarting,
  prize: getPrize(initialBody),
  lives: initialNoOfLives,
  snakeLength: initialSnakeLength,
};
type SnakeState = typeof initialState;

const resetState = (state: SnakeState) => {
  state.body = initialBody;
  state.direction = initialDirection;
  state.previousDirection = initialDirection;
  state.level = initialLevel;
  state.isRunning = initialIsRunning;
  state.prize = getPrize(initialBody);
  state.lives = initialNoOfLives
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
      if (state.level < 10) state.level += 1;
    },
    levelDown: (state) => {
      if (state.level > 1) state.level += -1;
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
        && !isPartOfTheBody(newHead, state.body)) {
          if (state.body.length < state.snakeLength) {
            state.body.push(newHead);
          } else if (newHead.column === state.prize.column
            && newHead.row === state.prize.row ){
            state.body.push(newHead);
            state.prize = getPrize(state.body);
          } else {
            state.body.push(newHead);
            state.body.shift();
          }
      } else {
        console.log("Snake outside of bounds" + newHead.column + "." + newHead.row);
        state.snakeLength = state.lives > 0 ? state.body.length : initialSnakeLength;
        state.isRestarting = true;
        state.isRunning = false;
      }
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setIsRestarting: (state, action: PayloadAction<boolean>) => {
      state.isRestarting = action.payload;
    }
  },
});

export const getNoOfLives = (state: RootState) => state.snake.lives;
export const getIsRestarting = (state: RootState) => state.snake.isRestarting;
export const getIsRunning = (state: RootState) => state.snake.isRunning;
export const getSnakeHead = (state: RootState) => state.snake.body[state.snake.body.length-1];
export const getSnakeTail = (state: RootState) => state.snake.body[0];
export const getLevel = (state: RootState) => state.snake.level;
export const {
  changeDirection, levelUp, snakeReset,
  levelDown, setIsRestarting, setIsRunning,
  move } = snakeSlice.actions;
export default snakeSlice.reducer;
