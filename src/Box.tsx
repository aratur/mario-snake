import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { selectById, Grid } from './store/gridSlice';

type Props = { column: number, row: number }
const Box = ({ column, row }: Props) => {
  const gridItem: Grid | undefined = useTypedSelector(state => selectById(state, column, row));
  const getBackbroud = () => {
    let result: string | undefined;
    if (gridItem){
      result = (gridItem.isWall) ? "bg-primary" : undefined;
      result = result || gridItem.isHead ? "bg-secondary" : result;
      result = result || gridItem.isTail ? "bg-success" : result;
      result = result || gridItem.isSnake ? "bg-danger" : result;
    }
    return result;
  }
  const boxStyle = { width: '20px', height: '20px'}
  return (
    <td className={"" + getBackbroud()} style={boxStyle} >
      .
    </td>
  );
};

export default Box;
