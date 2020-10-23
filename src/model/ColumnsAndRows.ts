export const numberOfColumns = 13;
export const numberOfRows = 13;
export const columns: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);
export const rows: Array<number> = Array(numberOfRows)
  .fill(0).map((_, index) => index + 1);
