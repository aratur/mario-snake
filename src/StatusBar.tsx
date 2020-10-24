import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { getNoOfLives } from './store/snakeSlice';
import mushroom from './img/mario-mushroom.png';
import disabledMushroom from './img/mario-mushroom-disabled.png';
import { numberOfColumns } from './model/ColumnsAndRows';
import Points from './Points';

const StatusBar = () => {
  const lives: number = useTypedSelector(getNoOfLives);
  const disabled: number = 3 - lives;
  const points: number = 6;
  const space: number = numberOfColumns - lives - disabled - points;

  return (
    <tr>
      {Array(lives).fill(0).map((_, index) =>
        <td key={"mushroom." + String(index)}>
          <img src={mushroom} alt="L" className="points" />
        </td>)}
      {Array(disabled).fill(0).map((_, index) =>
        <td key={"mushroomdisabled." + String(index)}>
          <img src={disabledMushroom} alt="L" className="points" />
        </td>)}
      {Array(space).fill(0).map((_, index) => <td
        key={"space." + String(index)} />)}
      <Points />
    </tr>
  );
};

export default StatusBar;
