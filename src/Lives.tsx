import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { getNoOfLives } from './store/snakeSlice';
import mushroom from './img/mario-mushroom.svg';

const Lives = () => {
  const lives: number = useTypedSelector(getNoOfLives);
  return (
    <tr>
      {Array(lives).fill(0).map((_) =>
        <td>
          <img src={mushroom} alt="L" width="20" height="20"/>
        </td>)}
    </tr>
  );
};

export default Lives;
