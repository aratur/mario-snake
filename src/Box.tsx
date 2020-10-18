import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { selectById } from './store/gridSlice';
import Grid from './model/Grid';
import Coordinates from './model/Coordinates';
import wall from './img/mario-wall.svg';
import bricks from './img/mario-bricks.svg';
import coin from './img/mario-coin.svg';

const Box = ({ column, row }: Coordinates) => {
  const gridItem: Grid | undefined = useTypedSelector(state => selectById(state, column, row));
  const getBackbroud = () => {
    if (gridItem){
      if (gridItem.isWall) return "bg-info";
      if (gridItem.isHead) return "bg-primary";
      if (gridItem.isTail) return "bg-danger";
      if (gridItem.isSnake) return "bg-warning";
      if (gridItem.isPrize) return "bg-success";
    }
    return undefined;
  }
  const getContent = () => {
    if (gridItem){
      if (gridItem.isWall) return <img src={wall} width={20} height={20} alt="W"/>;
      if (gridItem.isHead) return "H";
      if (gridItem.isTail) return "T";
      if (gridItem.isSnake) return "S";
      if (gridItem.isPrize) return <img src={coin} width={20} height={20} alt="C"/>;
      if (gridItem.isBrick) return <img src={bricks} width={20} height={20} alt="B"/>
    }
    return undefined;
  }
  const boxStyle = { width: '20px', height: '20px', lineHeight: '0px'}
  return (
    <td className={"" + getBackbroud()} style={boxStyle} >
      {getContent()}
    </td>
  );
};

export default Box;
