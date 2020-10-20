export const numberOfColumns = 10;
export const numberOfRows = 8;
export const columns: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);
export const rows: Array<number> = Array(numberOfRows)
  .fill(0).map((_, index) => index + 1);
