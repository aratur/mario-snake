import { configureStore } from '@reduxjs/toolkit';
import gridReducer, { Grid, updateHead, updateTail } from './gridSlice';
import snakeReducer,
  { getSnakeHead, getSnakeTail, move } from './snakeSlice';

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
    const oldTail = getSnakeTail(getState());
    dispatch(move());
    const newHead = getSnakeHead(getState());
    const newTail = getSnakeTail(getState());
    dispatch(updateHead(newHead));
    dispatch(updateTail(newTail));
  }
}

export default store;
