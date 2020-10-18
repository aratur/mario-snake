export const numberOfColumns = 25;
export const numberOfRows = 27;
export const columns: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);
export const rows: Array<number> = Array(numberOfRows)
  .fill(0).map((_, index) => index + 1);
