import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import gridReducer, {
  updateTailAndHeadAndPrize, gridReset, gridResize } from './gridSlice';
import snakeReducer,
  { getSnakeHead, getSnakeTail, getSnakeBody,
    getWasKilled, snakeResize,
    snakeResetAndResize, snakeOrientationChanged,
    move, snakeReset, getBricks } from './snakeSlice';
import sizeReducer,
  { changeNumberOfColumnsAndRows,
  getSize, ColumnsAndRowsI } from './columnsAndRowsSlice';
import Coordinates from '../model/Coordinates';
import guiReducer from './guiSlice';

const store = configureStore({
  reducer: {
    grid: gridReducer,
    snake: snakeReducer,
    size: sizeReducer,
    gui: guiReducer,
  },
  middleware: [thunk]
});

type DispatchType = typeof store.dispatch;
type GetStoreType = typeof store.getState;

export type RootState = ReturnType<typeof store.getState>
export const coputeStateThunk = () => {
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
    dispatch(move(size));

    // const moveA =  Date.now() - startTime;
    // values.push(moveA);
    // const moveB =  Date.now() - startTime;

    // update Head and Taild on the grid
    const newTail: Coordinates = getSnakeTail(getState());
    const newHead = getSnakeHead(getState());
    const newPrize: Coordinates = getState().snake.prize;

    dispatch(updateTailAndHeadAndPrize({oldTail,newTail, oldHead,newHead, oldPrize, newPrize}));
    // const headTailT = Date.now() - moveB - startTime;
    // values.push(headTailT);
    // check if the Prize has changed if yes updete on the grid
    //console.log("total:", Date.now() - startTime, "move:" + moveA, moveB, "headTail:" + headTailT, getAverage() );
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
  windowInnerWidth: number,
  force: boolean = false
) => {
  return (dispatch: DispatchType, getState: GetStoreType) => {
    const oldSize: ColumnsAndRowsI = getSize(getState())
    dispatch(changeNumberOfColumnsAndRows({windowInnerWidth, windowInnerHeight}));
    const newSize: ColumnsAndRowsI = getSize(getState());
    // console.log(oldSize, newSize);
    if (newSize.numberOfColumns === oldSize.numberOfColumns
      && newSize.numberOfRows === oldSize.numberOfRows && !force){
      // do nothing
      // console.log('doing nothing');
    } else if (newSize.numberOfRows >= oldSize.numberOfRows
      && newSize.numberOfColumns >= oldSize.numberOfColumns && !force){
      // size is larger in at least one dimension
      // and not smaller in the other one
      // reset Snake location - don't restart the game
      dispatch(snakeResize(newSize));
      const bricks = getBricks(getState());
      dispatch(gridReset({ bricks, size: newSize }));
    } else if (newSize.numberOfColumns === oldSize.numberOfRows
      && newSize.numberOfRows === oldSize.numberOfColumns && !force) {
      // This should be true if screen was rotated but rarely is, as on mobile
      // there is a different amount of available space depending on an aspect.
      // It may work a bit better in a full screen mode.
      dispatch(snakeOrientationChanged(newSize));
      const bricks = getBricks(getState());
      const body = getSnakeBody(getState());
      dispatch(gridResize({ bricks, size: newSize , body}));
      // console.log('screen orientation changed')
    } else {
      // console.log('other restart all');
      dispatch(snakeResetAndResize(newSize));
      const bricks = getBricks(getState());
      dispatch(gridReset({ bricks, size: newSize }));
    }
  }
}

export default store;
