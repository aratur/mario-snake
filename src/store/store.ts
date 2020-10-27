import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import gridReducer, {
  updateTailAndHeadAndPrize, gridReset } from './gridSlice';
import snakeReducer,
  { getSnakeHead, getSnakeTail,
    getWasKilled,
    snakeResetAndResize, snakeOrientationChanged,
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
  middleware: [thunk]
});

type DispatchType = typeof store.dispatch;
type GetStoreType = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>
const values: Array<number> = [];
const getAverage = () => Math.floor(values.reduce((pv, cv) => pv+cv, 0)/values.length);
export const coputeStateThunk = (startTime: number) => {
  return async (dispatch: DispatchType, getState: GetStoreType) => {
    const wasKilled = getWasKilled(getState());
    if (wasKilled) {
      resetStateThunk();
    }

    // store previous Head and Tail location
    const oldHead: Coordinates = getSnakeHead(getState());
    const oldTail: Coordinates = getSnakeTail(getState());

    // compute next state
    const size: ColumnsAndRowsI = getSize(getState());
    const oldPrize: Coordinates = getState().snake.prize;
    dispatch(move({size, startTime, initTime: Date.now()}));

    const moveA =  Date.now() - startTime;
    values.push(moveA);
    await new Promise(r => setTimeout(r, 20-moveA));
    const moveB =  Date.now() - startTime;

    // update Head and Taild on the grid
    const newTail: Coordinates = getSnakeTail(getState());
    const newHead = getSnakeHead(getState());
    const newPrize: Coordinates = getState().snake.prize;

    dispatch(updateTailAndHeadAndPrize({oldTail,newTail, oldHead,newHead, oldPrize, newPrize}));
    const headTailT = Date.now() - moveB - startTime;
    values.push(headTailT);
    await new Promise(r => setTimeout(r, 20-headTailT));
    // check if the Prize has changed if yes updete on the grid
    console.log("total:", Date.now() - startTime, "move:" + moveA, moveB, "headTail:" + headTailT, getAverage() );
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
    if (newSize.numberOfColumns === oldSize.numberOfColumns
      && newSize.numberOfRows === oldSize.numberOfRows){
      // do nothing
      console.log('doing nothing');
    } else if (newSize.numberOfRows >= oldSize.numberOfRows
      && newSize.numberOfColumns >= oldSize.numberOfColumns){
      // size is larger in at least one dimension
      // and not smaller in the other one
      // reset Snake location - don't restart the game
      dispatch(snakeReset(newSize));
    } else if (newSize.numberOfColumns === oldSize.numberOfRows
      && newSize.numberOfRows === oldSize.numberOfColumns) {
      // this should be true if screen was rotated
      dispatch(snakeOrientationChanged());
      console.log('screen orientation changed')
    } else {
      console.log('other restart all');
      dispatch(snakeResetAndResize(newSize));
    }
    const bricks = getBricks(getState());
    dispatch(gridReset({ bricks, size: newSize }));
  }
}

export default store;
