import { configureStore } from '@reduxjs/toolkit';
import gridReducer, {
  updateHead, updateTail, updatePrize, gridReset } from './gridSlice';
import snakeReducer,
  { getSnakeHead, getSnakeTail, setIsRestarting,
    move, snakeReset } from './snakeSlice';

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
    const oldHead = getSnakeHead(getState());
    dispatch(move());
    const newHead = getSnakeHead(getState());
    const newTail = getSnakeTail(getState());
    if (oldHead !== newHead) {
      dispatch(updateHead(newHead));
      dispatch(updateTail(newTail));
      dispatch(updatePrize(getState().snake.prize));
    }
  }
}

export const resetState = () => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    if (getState().snake.isRestarting) {
      dispatch(snakeReset());
      dispatch(gridReset());
      dispatch(setIsRestarting(false));
    }
  }
}

export default store;
