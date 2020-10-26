import { configureStore } from '@reduxjs/toolkit';
import gridReducer, {
  updateHead, updateTail, updatePrize, gridReset } from './gridSlice';
import snakeReducer,
  { getSnakeHead, getSnakeTail, getWasKilled, setPreviousPrize,
    move, snakeReset, getBricks } from './snakeSlice';
import sizeReducer,
  { changeNumberOfColumnsAndRows,
  getSize, ColumnsAndRowsI } from './columnsAndRowsSlice';
import Coordinates from '../model/Coordinates';

const store = configureStore({
  reducer: {
    grid: gridReducer,
    snake: snakeReducer,
    size: sizeReducer,
  },
});

type DispatchType = typeof store.dispatch;
type GetStoreType = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>

export const coputeStateThunk = () => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    const wasKilled = getWasKilled(getState());
    if (wasKilled) {
      resetStateThunk();
    }

    // store previous Head and Tail location
    const oldHead: Coordinates = getSnakeHead(getState());
    const oldTail: Coordinates = getSnakeTail(getState());

    // compute next state
    const size: ColumnsAndRowsI = getSize(getState());
    dispatch(move(size));

    // update Head and Taild on the grid
    const newTail: Coordinates = getSnakeTail(getState());
    const newHead = getSnakeHead(getState());
    if (oldTail !== newTail) dispatch(updateTail(newTail));
    if (oldHead !== newHead) dispatch(updateHead(newHead));
    // check if the Prize has changed if yes updete on the grid
    const previousPrize: Coordinates = getState().snake.previousPrize;
    const newPrize: Coordinates = getState().snake.prize;
    if (previousPrize.column !== newPrize.column
      || previousPrize.row !== newPrize.row) {
      dispatch(updatePrize(getState().snake.prize));
      dispatch(setPreviousPrize(newPrize));
    }
  }
}

export const resetStateThunk = () => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    const size: ColumnsAndRowsI = getSize(getState())
    dispatch(snakeReset(size));
    const bricks = getBricks(getState());
    dispatch(gridReset({ bricks, size }));
  }
}


export const changeNumberOfColumnsAndRowsThunk = (
  windowInnerHeight: number,
  windowInnerWidth: number
) => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    const oldSize: ColumnsAndRowsI = getSize(getState())
    dispatch(changeNumberOfColumnsAndRows({windowInnerWidth, windowInnerHeight}));
    const newSize: ColumnsAndRowsI = getSize(getState());
    console.log(oldSize, newSize);
    dispatch(snakeReset(newSize));
    const bricks = getBricks(getState());
    dispatch(gridReset({ bricks, size: newSize }));
  }
}

export default store;
