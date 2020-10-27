/* eslint "no-param-reassign": 0 */
import {
  createEntityAdapter,
  createSlice, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from './store';
import Grid from '../model/Grid';
import Coordinates from '../model/Coordinates';
import { ColumnsAndRowsI } from './columnsAndRowsSlice';

const gridAdapter = createEntityAdapter<Grid>({
  selectId: (item) => item.column * 100 + item.row,
});

const gridState = gridAdapter.getInitialState();
type GridState = typeof gridState;

export const isPartOfSpace = (newCoordinates: Coordinates, body: Array<Coordinates>) =>
  body.findIndex(value => value.column === newCoordinates.column
    && value.row === newCoordinates.row) > -1 ? true : false;

type GridInput = {
  bricks: Array<Coordinates>,
  size: ColumnsAndRowsI
}
const createGrid = (state: GridState, input: GridInput) => {
  Array(input.size.numberOfColumns)
    .fill(0)
    .map((_, index) => index + 1)
    .forEach((column) => {
      Array(input.size.numberOfRows)
      .fill(0)
      .map((_, index) => index + 1)
      .forEach((row) => {
        gridAdapter.addOne(state, {
          column,
          row,
          isSnake: false,
          isHead: false,
          isTail: false,
          isPrize: false,
          isBrick: !isPartOfSpace({column, row}, input.bricks),
          isWall: row - 1 === 0
            || column - 1 === 0
            || row === input.size.numberOfRows
            || column === input.size.numberOfColumns,
          });
        });
      });
};

const id = (input: Coordinates) => input.column*100 + input.row;

type HeadAndTail = {
  oldTail: Coordinates,
  newTail: Coordinates,
  oldHead: Coordinates,
  newHead: Coordinates,
  oldPrize: Coordinates,
  newPrize: Coordinates,
}

let previousHeadId: number | undefined = undefined;
let previousTailId: number | undefined = undefined;
let previousPrizeId: number | undefined = undefined;

const gridSlice = createSlice({
  name: 'grid',
  initialState: gridState,
  reducers: {
    gridReset: (state, action: PayloadAction<GridInput>) => {
      gridAdapter.removeAll(state);
      createGrid(state, action.payload);
      previousHeadId = undefined;
      previousTailId = undefined;
      previousPrizeId = undefined;
    },
    updateTailAndHeadAndPrize: (state, action: PayloadAction<HeadAndTail>) => {

      const { oldTail, newTail,
        oldHead, newHead,
        oldPrize, newPrize  } = action.payload;

      if (oldTail.column !== newTail.column || oldTail.row !== newTail.row){
        let oldTailId = undefined;
        if (previousTailId) {
          oldTailId = previousTailId;
        } else {
          oldTailId = state.ids.find(id => state.entities[id]?.isTail)
        }
        if (oldTailId){
          const oldTailEntity = state.entities[oldTailId];
          if (oldTailEntity) {
            oldTailEntity.isTail = false;
          }
        }
        const newTailId = id(newTail);
        previousTailId = newTailId;
        const newTailEntity = state.entities[newTailId];
        if (newTailEntity) {
          newTailEntity.isTail = true;
          newTailEntity.isSnake = false;
        }
      }

      if (oldHead.column !== newHead.column || oldHead.row !== newHead.row){
        let oldHeadId = undefined;
        if (previousHeadId) {
          oldHeadId = previousHeadId;
        } else {
          oldHeadId = state.ids.find(id => state.entities[id]?.isHead)
        }
        if (oldHeadId){
          const oldHeadEntity = state.entities[oldHeadId];
          if (oldHeadEntity) {
            oldHeadEntity.isHead = false;
            oldHeadEntity.isSnake = true;
          }
        }
        const newHeadId = id(newHead);
        previousHeadId = newHeadId;
        const newHeadEntity = state.entities[newHeadId];
        if (newHeadEntity) {
          newHeadEntity.isHead = true;
          newHeadEntity.isBrick = false;
        };
      }

      let oldPrizeId = undefined;
      if (previousPrizeId) {
        oldPrizeId = previousPrizeId;
      } else {
        oldPrizeId = state.ids.find(id => state.entities[id]?.isPrize);
      }
      if (oldPrize.column !== newPrize.column
        || oldPrize.row !== newPrize.row
        || typeof oldPrizeId === "undefined") {
        if (oldPrizeId){
          const oldPrizeEntity = state.entities[oldPrizeId];
          if (oldPrizeEntity) oldPrizeEntity.isPrize = false;
        }
        const newPrizeId = id(newPrize);
        previousPrizeId = newPrizeId;
        const newPrizeEntity = state.entities[newPrizeId];
        if (newPrizeEntity) {
          newPrizeEntity.isPrize = true;
        }
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
export const { updateTailAndHeadAndPrize,
  gridReset } = gridSlice.actions;
export default gridSlice.reducer;
