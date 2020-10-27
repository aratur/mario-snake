import React, { useMemo } from 'react';
import Box from './Box';

type Props = {
  numberOfRows: number,
  numberOfColumns: number
}
const Bricks = ({ numberOfRows, numberOfColumns } : Props) => {
  // saves 30 ms after each dispatch
  const memoRenderBricks = useMemo(() => Array(numberOfRows)
    .fill(0)
    .map((_, index) => index + 1)
    .map((row) => (
      <tr key={'row.' + String(row)}>
        {Array(numberOfColumns)
          .fill(0)
          .map((_, index) => index + 1)
          .map((column) => <Box
          column={column}
          row={row}
          key={ String(column * 100 + row) }
          />)}
          </tr>
        )
      ), [numberOfRows, numberOfColumns]
  );

  return <>
    {memoRenderBricks}
    </>
}

export default Bricks;
