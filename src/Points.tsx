import React from 'react';
import { useTypedSelector } from './store/TypedUtils';
import { getNoOfPoints } from './store/snakeSlice';
import coin from './img/mario-coin.png';
import i0 from './img/0.png';
import i1 from './img/1.png';
import i2 from './img/2.png';
import i3 from './img/3.png';
import i4 from './img/4.png';
import i5 from './img/5.png';
import i6 from './img/6.png';
import i7 from './img/7.png';
import i8 from './img/8.png';
import i9 from './img/9.png';

const Points = () => {
  const points: number = useTypedSelector(getNoOfPoints);
  const paddingZeros = (input: number, padding: number) => {
      const inputStr = String(input);
      return Array(padding)
        .fill(0).map((_, index) => (padding-index) <= inputStr.length ? inputStr[index - padding + inputStr.length] : 0);
  }

  const renderNumbers = () => {
    const digits = 4;
    const paddedPoints = paddingZeros(points, digits);
    return paddedPoints.map(digit => {
      switch(Number(digit)){
      case 0: return { src: i0, digit };
      case 1: return { src: i1, digit };
      case 2: return { src: i2, digit };
      case 3: return { src: i3, digit };
      case 4: return { src: i4, digit };
      case 5: return { src: i5, digit };
      case 6: return { src: i6, digit };
      case 7: return { src: i7, digit };
      case 8: return { src: i8, digit };
      case 9: return { src: i9, digit };
      default: return { src: i0, digit };
    }}).map((picture, index)=> {
      return <td key={`td.pos.${index}.no.${picture.digit}`}>
      <img className="points" src={picture.src} alt={String(picture.digit)}
        key={`img.pos.${index}.no.${picture.digit}`} /></td>});
  };

  return (
    <>
    <td key="coin">
      <img className="points" src={coin} alt="No of points" />
    </td>
    <td>X</td>
    {renderNumbers()}
    </>
  );
};

export default Points;
