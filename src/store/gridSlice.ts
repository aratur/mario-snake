/* eslint "no-param-reassign": 0 */
import {
  createEntityAdapter,
  createSlice, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import Grid from '../model/Grid';
import Coordinates from '../model/Coordinates';
import { columns, rows,
  numberOfRows, numberOfColumns } from '../model/ColumnsAndRows';

const gridAdapter = createEntityAdapter<Grid>({
  selectId: (item) => item.column * 100 + item.row,
});

const gridState = gridAdapter.getInitialState();
type GridState = typeof gridState;

export const isPartOfSpace = (newCoordinates: Coordinates, body: Array<Coordinates>) =>
  body.findIndex(value => value.column === newCoordinates.column
    && value.row === newCoordinates.row) > -1 ? true : false;

const createGrid = (state: GridState, bricks: Array<Coordinates>) => {
  columns.forEach((column) => {
    rows.forEach((row) => {
      gridAdapter.addOne(state, {
        column,
        row,
        isSnake: false,
        isHead: false,
        isTail: false,
        isPrize: false,
        isBrick: !isPartOfSpace({column, row}, bricks),
        isWall: row - 1 === 0 || column - 1 === 0
          || row === numberOfRows || column === numberOfColumns,
      });
    });
  });
};

const id = (input: Coordinates) => input.column*100 + input.row;

const gridSlice = createSlice({
  name: 'grid',
  initialState: gridState,
  reducers: {
    gridReset: (state, action: PayloadAction<Array<Coordinates>>) => {
      gridAdapter.removeAll(state);
      createGrid(state, action.payload);
    },
    updateHead: (state, action: PayloadAction<Coordinates>) => {
      const oldHeadId = state.ids.find(id => state.entities[id]?.isHead)
      if (oldHeadId){
        const oldHeadEntity = state.entities[oldHeadId];
        if (oldHeadEntity) {
          oldHeadEntity.isHead = false;
          oldHeadEntity.isSnake = true;
        }
      }
      const newHeadId = id(action.payload);
      const newHeadEntity = state.entities[newHeadId];
      if (newHeadEntity) {
        newHeadEntity.isHead = true;
        newHeadEntity.isBrick = false;
      };
    },
    updateTail: (state, action: PayloadAction<Coordinates>) => {
      const oldTailId = state.ids.find(id => state.entities[id]?.isTail)
      if (oldTailId){
        const oldTailEntity = state.entities[oldTailId];
        if (oldTailEntity) {
          oldTailEntity.isTail = false;
        }
      }
      const newTailId = id(action.payload);
      const newTailEntity = state.entities[newTailId];
      if (newTailEntity) {
        newTailEntity.isTail = true;
        newTailEntity.isSnake = false;
      }
    },
    updatePrize: (state, action: PayloadAction<Coordinates>) => {
      const oldPrizeId = state.ids.find(id => state.entities[id]?.isPrize)
      if (oldPrizeId){
        const oldPrizeEntity = state.entities[oldPrizeId];
        if (oldPrizeEntity) oldPrizeEntity.isPrize = false;
      }
      const newPrizeId = id(action.payload);
      const newPrizeEntity = state.entities[newPrizeId];
      if (newPrizeEntity) {
        newPrizeEntity.isPrize = true;
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
export const { updateHead, updateTail,
  updatePrize, gridReset } = gridSlice.actions;
export default gridSlice.reducer;
