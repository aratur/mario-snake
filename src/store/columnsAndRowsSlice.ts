import {createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialNumberOfColumns = 10;
const minNumberOfColumns = initialNumberOfColumns;
const initialNumberOfRows = 10;
const minNumberOfRows = initialNumberOfRows;
const rowHeight: number = 25;
const colWidth: number = 25;
const statusBarHeight: number = 25;
const bottomMargin: number = 25;
const w3margins: number = 50;
const navigationWidth: number = 184;
const navigationHeight: number = 194;
const maxColumns: number = 20;
const maxRows: number = 20;

export type ColumnsAndRowsI = {
  numberOfColumns: number,
  numberOfRows: number
}
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

      let height: number;
      let width: number;
      if (windowWidth < 600) {
        height = windowHeight -
          statusBarHeight - navigationHeight - bottomMargin;
        width = windowWidth - w3margins - 0;
      } else {
        height = windowHeight - statusBarHeight - bottomMargin;
        width = windowWidth - navigationWidth - w3margins - 10;
      }

      const possibleColumns: number = Math.floor(width/colWidth);
      const possibleRows: number = Math.floor(height/rowHeight);
      console.log(windowWidth, windowHeight, width, height);

      if (possibleRows < minNumberOfRows) {
        state.numberOfRows = minNumberOfRows;
      } else if (possibleRows > maxRows) {
        state.numberOfRows = maxRows;
      } else {
        state.numberOfRows = possibleRows;
      }

      if (possibleColumns < minNumberOfColumns) {
        state.numberOfColumns = minNumberOfColumns;
      } else if (possibleColumns > maxColumns) {
        state.numberOfColumns = maxColumns;
      } else {
        state.numberOfColumns = possibleColumns;
      }
    }
  },
});

export const getSize = (state: RootState): ColumnsAndRowsI => {
  return {
    numberOfColumns: state.size.numberOfColumns,
    numberOfRows: state.size.numberOfRows
  }
};
export const { changeNumberOfColumnsAndRows } = columnsAndRowsSlice.actions;
export default columnsAndRowsSlice.reducer;
