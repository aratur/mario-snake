import {createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialNumberOfColumns = 13;
const minNumberOfColumns = initialNumberOfColumns;
const initialNumberOfRows = 13;
const minNumberOfRows = initialNumberOfRows;
const rowHeight: number = 25;
const colWidth: number = 25;
const statusBarHeight: number = 25;
const w3margins: number = 50;
const navigationWidth: number = 230;
const maxColumns: number = 20;
const maxRows: number = 20;

const columnsAndRowsSlice = createSlice({
  name: "size",
  initialState: {
    numberOfColumns: initialNumberOfColumns,
    numberOfRows: initialNumberOfRows,
  },
  reducers: {
    changeNumberOfColumnsAndRows: (state, action: PayloadAction<{
      windowInnerHeight: number, windowInnerWidth: number}>) => {

      const windowWidth: number = action.payload.windowInnerWidth;
      const windowHeight: number = action.payload.windowInnerHeight;

      const height: number = windowWidth - statusBarHeight;
      const width: number = windowHeight - navigationWidth - w3margins;
      const possibleColumns: number = Math.floor(width/colWidth);
      const possibleRows: number = Math.floor(height/rowHeight);
      console.log(width, height)
      //    ", R: ", state.numberOfRows, possibleRows,
      //    ", C: " ,state.numberOfColumns, possibleColumns);
      if (possibleRows >= minNumberOfRows && possibleRows <= maxRows){
        state.numberOfRows = possibleRows;
      }
      if (possibleColumns >= minNumberOfColumns && possibleColumns <= maxColumns){
        state.numberOfColumns = possibleColumns;
      }
    }
  },
});

export const getNumberOfColumns = (state: RootState): number => state.size.numberOfColumns;
export const getNumberOfRows = (state: RootState): number => state.size.numberOfRows;
// export const getColumns = (state: RootState): Array<number> => Array(state.size.numberOfColumns)
//   .fill(0).map((_, index) => index + 1);
// export const getRows = (state: RootState): Array<number> => Array(state.size.numberOfRows)
//   .fill(0).map((_, index) => index + 1);
export const { changeNumberOfColumnsAndRows } = columnsAndRowsSlice.actions;
export default columnsAndRowsSlice.reducer;
