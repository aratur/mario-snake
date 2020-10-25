import React from 'react';
import Box from './Box';

type Props = {
  rows: Array<number>,
  columns: Array<number>
}
const Bricks = ({rows, columns} : Props) => {
  return <>
    {rows
    .map((row) => (
      <tr key={'row.' + String(row)}>
        {columns.map((column) => <Box
          column={column}
          row={row}
          key={ String(column * 100 +row) }
        />)}
      </tr>
    ))}
    </>
}

export default Bricks;
