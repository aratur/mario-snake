import React from 'react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from './store/TypedUtils';
import {
  changeDirection, getLevel, levelUp, levelDown,
  } from './store/snakeSlice';
import arrowUp from './img/arrow-up.svg';
import arrowDown from './img/arrow-down.svg';
import arrowLeft from './img/arrow-left.svg';
import arrowRight from './img/arrow-right.svg';
import play from './img/play.svg';
import pause from './img/pause.svg';
import slowerImg from './img/slower.svg';
import fasterImg from './img/faster.svg';

type Props = {
  start: () => void,
  stop: () => void,
  name: string,
}
const NavigationButton = ({start, stop, name} : Props) => {
  const dispatch = useDispatch();
  const level = useTypedSelector(getLevel);

  const faster = ():void => {
    dispatch(levelUp());
  };
  const slower = ():void => {
    dispatch(levelDown());
  };

  const handleImageClicked = () => {};

  const handleButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const pressed = event.target as HTMLElement;
    let name = "unknown";
    if (pressed.hasAttribute("alt")) {
      name = (event.target as HTMLImageElement).alt;
    } else {
      name = (event.target as HTMLButtonElement).value;
    }

    switch(name) {
      case 'Stop': stop(); break;
      case 'Start': start(); break;
      case 'Slower': slower(); break;
      case 'Faster': faster(); break;
      default: dispatch(changeDirection(name));
    }
  };

  const getImage = (name: string) => {
    switch(name) {
      case 'Up': return arrowUp;
      case 'Down': return arrowDown;
      case 'Left': return arrowLeft;
      case 'Right': return arrowRight;
      case 'Stop': return pause;
      case 'Start': return play;
      case 'Faster': return fasterImg;
      case 'Slower': return slowerImg;
      default: return play;
    }
  }

  return <button
      type="button"
      className="navigation"
      value={name}
      key={name}
      onClick={handleButtonClicked}>
        <img
          onClick={handleImageClicked}
          className="navigation"
          src={getImage(name)}
          alt={name}
          style={(('Slower' === name && level === 1)
          || ('Faster' === name && level === 10))
            ? { visibility: 'hidden'}
            : {}}
        />
    </button>
}

export default NavigationButton;
