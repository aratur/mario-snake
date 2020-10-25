import React from 'react';
import Box from './Box';

type Props = {
  numberOfRows: number,
  numberOfColumns: number
}
const Bricks = ({ numberOfRows, numberOfColumns } : Props) => {
  return <>
    {Array(numberOfRows)
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
    ))}
    </>
}

export default Bricks;
