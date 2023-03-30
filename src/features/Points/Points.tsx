import React from 'react';
import coin from '../../assets/prize.svg';
import i0 from '../../assets/points/0.svg';
import i1 from '../../assets/points/1.png';
import i2 from '../../assets/points/2.png';
import i3 from '../../assets/points/3.png';
import i4 from '../../assets/points/4.png';
import i5 from '../../assets/points/5.png';
import i6 from '../../assets/points/6.png';
import i7 from '../../assets/points/7.png';
import i8 from '../../assets/points/8.png';
import i9 from '../../assets/points/9.svg';
import { useCustomStore } from '../../store/storeInstance';
import style from './points.module.scss';

const addPaddingToPoints = (input: number, padding: number) => {
  const inputStr = String(input);
  return Array(padding)
    .fill(0)
    .map((_, index) =>
      padding - index <= inputStr.length
        ? inputStr[index - padding + inputStr.length]
        : 0
    );
};

const Points = () => {
  const [points] = useCustomStore(({ points }) => points);

  const renderNumbers = () => {
    const digits = 4;
    const pointsWithPadding = addPaddingToPoints(points, digits);
    const pointsWithImages = pointsWithPadding.map((digit) => {
      switch (Number(digit)) {
        case 1:
          return { src: i1, digit };
        case 2:
          return { src: i2, digit };
        case 3:
          return { src: i3, digit };
        case 4:
          return { src: i4, digit };
        case 5:
          return { src: i5, digit };
        case 6:
          return { src: i6, digit };
        case 7:
          return { src: i7, digit };
        case 8:
          return { src: i8, digit };
        case 9:
          return { src: i9, digit };
        default:
          return { src: i0, digit };
      }
    });
    return pointsWithImages.map((picture, index) => (
      <img
        src={picture.src}
        alt={String(picture.digit)}
        key={`img.pos.${index + 1}.no.${picture.digit}`}
      />
    ));
  };

  return (
    <div className={style.points}>
      <img src={coin} alt="No of points" />
      <span>X</span>
      {renderNumbers()}
    </div>
  );
};

export default Points;
