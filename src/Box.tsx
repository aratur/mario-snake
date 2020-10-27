import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { selectById } from './store/gridSlice';
import Grid from './model/Grid';
import Coordinates from './model/Coordinates';
import wall from './img/mario-wall.png';
import bricks from './img/mario-bricks.png';
import coin from './img/mario-coin.png';
import head from './img/mario.png';
import body from './img/bag.png';

// let previousTime = 999999;
// const values: Array<number> = [];
// const getAverage = () => Math.floor(values.reduce((pv, cv) => pv+cv, 0)/values.length);
// const measurePerformance = (time: number) => {
//   if (previousTime === 999999) {
//     previousTime = time - 175;
//   }
//   if (time - previousTime > 10){
//     values.push(time - previousTime);
//     previousTime = time;
//     if (values.length > 10 ) values.shift();
//     console.log(Math.abs(175-getAverage()))
//   }
//}

const Box = ({ column, row }: Coordinates) => {
  const gridItem: Grid | undefined = useTypedSelector(state => selectById(state, column, row));

  const getContent = () => {
    if (gridItem){
      if (gridItem.isWall) return <img src={wall} alt="W" className="board" />;
      if (gridItem.isHead) {
        // measurePerformance(Date.now())
        return <img src={head} alt="H" className="board" />;
      }
      if (gridItem.isTail) return <img src={body} alt="T" className="board" />;;
      if (gridItem.isSnake) return <img src={body} alt="S" className="board" />;
      if (gridItem.isPrize) return <img src={coin} alt="C" className="board" />;
      if (gridItem.isBrick) return <img src={bricks} alt="B" className="board" />
    }
    return undefined;
  }

  return (
    <td>
      {getContent()}
    </td>
  );
};

export default Box;
