import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { getNoOfLives } from './store/snakeSlice';
import mushroom from './img/mario-mushroom.svg';
import { numberOfColumns } from './model/ColumnsAndRows';
import Points from './Points';

const StatusBar = () => {
  const lives: number = useTypedSelector(getNoOfLives);
  const space: number = numberOfColumns - lives - 6;
  return (
    <tr>
      {Array(lives).fill(0).map((_, index) =>
        <td key={"mushroom." + String(index)}>
          <img src={mushroom} alt="L" width="30" height="30"/>
        </td>)}
      {Array(space).fill(0).map((_, index) => <td
        key={"space." + String(index)} />)}
      <Points />
    </tr>
  );
};

export default StatusBar;
