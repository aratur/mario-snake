import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { selectById } from './store/gridSlice';
import Grid from './model/Grid';
import Coordinates from './model/Coordinates';
import wall from './img/mario-wall.svg';
import bricks from './img/mario-bricks.svg';
import coin from './img/mario-coin.svg';
import head from './img/mario.png';
import body from './img/silver-body-i.svg';

const Box = ({ column, row }: Coordinates) => {
  const gridItem: Grid | undefined = useTypedSelector(state => selectById(state, column, row));

  const getContent = () => {
    if (gridItem){
      if (gridItem.isWall) return <img src={wall} width={30} height={30} alt="W"/>;
      if (gridItem.isHead) return <img src={head} width={30} height={30} alt="H"/>;
      if (gridItem.isTail) return <img src={body} width={30} height={30} alt="T"/>;;
      if (gridItem.isSnake) return <img src={body} width={30} height={30} alt="S"/>;
      if (gridItem.isPrize) return <img src={coin} width={30} height={30} alt="C"/>;
      if (gridItem.isBrick) return <img src={bricks} width={30} height={30} alt="B"/>
    }
    return undefined;
  }

  const boxStyle = { width: '30px', height: '30px', padding: 0 }
  return (
    <td style={boxStyle} >
      {getContent()}
    </td>
  );
};

export default Box;
