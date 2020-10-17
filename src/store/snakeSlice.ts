/* eslint "no-param-reassign": 0 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { columns, rows } from './gridSlice';

type Directions = { [direction: string]: {column: number, row: number},};

const directions: Directions = {
  Left: { column: -1, row: 0 },
  Right: { column: 1, row: 0 },
  Up: { column: 0, row: -1 },
  Down: { column: 0, row: 1 },
};

const initialDirection = directions.Right;
const initialSnakeBody = [
  { column: 2, row: 2 },
  { column: 3, row: 2 },
];
const initialLevel = 4;
const initialIsRunning = false;
const initialState = {
  snakeBody: initialSnakeBody,
  direction: initialDirection,
  level: initialLevel,
  isRunning: initialIsRunning,
};
type SnakeState = typeof initialState;

const resetState = (state: SnakeState) => {
  state.snakeBody = initialSnakeBody;
  state.direction = initialDirection;
  state.level = initialLevel;
  state.isRunning = initialIsRunning;
}

const snakeSlice = createSlice({
  name: 'snake',
  initialState,
  reducers: {
    changeDirection: (state, action: PayloadAction<string>) => {
        const oldDirection = state.direction;
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
    reset: (state) => {
      resetState(state);
    },
    addSegment: (state, action: PayloadAction<{column: number, row: number}>) => {
      state.snakeBody.push(action.payload);
    },
    move: (state) => {
      const oldHead = state.snakeBody[state.snakeBody.length-1];
      const newHead = {
        column: oldHead.column + state.direction.column,
        row: oldHead.row + state.direction.row
      };
      if (newHead.column <= columns.length
        && newHead.column >= 0
        && newHead.row <= rows.length
        && newHead.row >= 0 ) {
          state.snakeBody.push(newHead);
          state.snakeBody.shift();
      } else {
        console.log("Snake outside of bounds" + newHead.column + "." + newHead.row);
        resetState(state);
      }
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    }
  },
});

export const getIsRunning = (state: RootState) => state.snake.isRunning;
export const getSnakeHead = (state: RootState) => state.snake.snakeBody[state.snake.snakeBody.length-1];
export const getSnakeTail = (state: RootState) => state.snake.snakeBody[0];
export const getLevel = (state: RootState) => state.snake.level;
export const {
  changeDirection, levelUp,
  levelDown, reset, setIsRunning,
  addSegment, move } = snakeSlice.actions;
export default snakeSlice.reducer;
