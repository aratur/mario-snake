export const numberOfColumns = 20;
export const numberOfRows = 20;
export const columns: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);
export const rows: Array<number> = Array(numberOfColumns)
  .fill(0).map((_, index) => index + 1);
