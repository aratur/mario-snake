import { configureStore } from '@reduxjs/toolkit';
import gridReducer, {
  updateHead, updateTail, updatePrize, gridReset } from './gridSlice';
import snakeReducer,
  { getSnakeHead, getSnakeTail, setIsRestarting,
    move, snakeReset, getBricks } from './snakeSlice';
import Coordinates from '../model/Coordinates';

const store = configureStore({
  reducer: {
    grid: gridReducer,
    snake: snakeReducer,
  },
});

type DispatchType = typeof store.dispatch;
type GetStoreType = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>

export const coputeStateThunk = () => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    const oldHead: Coordinates = getSnakeHead(getState());
    const oldTail: Coordinates = getSnakeTail(getState());
    const oldPrize: Coordinates = getState().snake.previousPrize;
    dispatch(move());
    const newTail: Coordinates = getSnakeTail(getState());
    const newHead = getSnakeHead(getState());
    if (oldTail !== newTail) dispatch(updateTail(newTail));
    if (oldHead !== newHead) dispatch(updateHead(newHead));
    if (oldPrize !== getState().snake.prize) {
      dispatch(updatePrize(getState().snake.prize));
    }
  }
}

export const resetState = () => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    if (getState().snake.isRestarting) {
      dispatch(snakeReset());
      const bricks = getBricks(getState());
      dispatch(gridReset(bricks));
      dispatch(setIsRestarting(false));
    }
  }
}

export default store;
