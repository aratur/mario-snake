/* eslint "no-param-reassign": 0 */
import {
  createEntityAdapter,
  createSlice, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from './store';

const numberOfColumns = 20;
const numberOfRows = 20;
export const columns: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);
export const rows: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);

export type Grid = {
  column: number,
  row: number,
  isSnake: boolean,
  isHead: boolean,
  isTail: boolean,
  isWall: boolean,
}

const gridAdapter = createEntityAdapter<Grid>({
  selectId: (item) => item.column * 100 + item.row,
});

const gridState = gridAdapter.getInitialState();
type GridState = typeof gridState;

const createGrid = (state: GridState) => {
  columns.forEach((column) => {
    rows.forEach((row) => {
      gridAdapter.addOne(state, {
        column,
        row,
        isSnake: false,
        isHead: false,
        isTail: false,
        isWall: row - 1 === 0 || column - 1 === 0
          || row === numberOfRows || column === numberOfColumns,
      });
    });
  });
};

const id = (input: {column: number, row: number}) => input.column*100 + input.row;

const gridSlice = createSlice({
  name: 'grid',
  initialState: gridState,
  reducers: {
    reset: (state) => {
      gridAdapter.removeAll(state);
      createGrid(state);
    },
    updateHead: (state, action: PayloadAction<{column: number, row: number}>) => {
      const oldHeadId = state.ids.find(id => state.entities[id]?.isHead)
      if (oldHeadId){
        const oldHeadEntity = state.entities[oldHeadId];
        if (oldHeadEntity) {
          oldHeadEntity.isHead = false;
          oldHeadEntity.isSnake = true;
        }
      }
      const newHeadId = id(action.payload);
      console.log(newHeadId + " newHeadId")
      const newHeadEntity = state.entities[newHeadId];
      if (newHeadEntity) newHeadEntity.isHead = true;
    },
    updateTail: (state, action: PayloadAction<{column: number, row: number}>) => {
      const oldTailId = state.ids.find(id => state.entities[id]?.isTail)
      if (oldTailId){
        const oldTailEntity = state.entities[oldTailId];
        if (oldTailEntity) {
          oldTailEntity.isTail = false;
        }
      }
      const newTailId = id(action.payload);
      console.log(newTailId + " newTailId")
      const newTailEntity = state.entities[newTailId];
      if (newTailEntity) {
        newTailEntity.isTail = true;
        newTailEntity.isSnake = false;
      }
    },
  },
});

const gridSelectors = gridAdapter.getSelectors<RootState>(
  (state) => state.grid
)

export const selectById = (
    state: RootState, column: number, row: number
  ) => gridSelectors.selectById(state, column * 100 + row);
export const { updateHead, updateTail, reset } = gridSlice.actions;
export default gridSlice.reducer;
