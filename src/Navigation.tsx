import React from 'react';
import arrowUp from './img/arrow-up.svg';
import arrowDown from './img/arrow-down.svg';
import arrowLeft from './img/arrow-left.svg';
import arrowRight from './img/arrow-right.svg';
import play from './img/play.png';
import pause from './img/pause.svg';
import fireball from './img/fireball.png';
import slowerImg from './img/slower.png';
import fasterImg from './img/faster.png';

type Props = {
  start: () => void,
  stop: () => void,
  isRunning: boolean,
  changeDirection: (direction: string) => void,
  faster: () => void,
  slower: () => void,
  level: number,
};

const Navigation = ( {
    start, stop, isRunning, changeDirection, faster, slower, level,
  } : Props) => {
  const handleButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
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

      default: if (['Left','Right','Up','Down'].includes(name))
        changeDirection(name);
    }
  }

  const handleImageClicked = () => {};
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

  const button = (name: string) => {
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

  return (
  <>
    <div className="w3-cell-row" >
      <div className="w3-cell w3-cell-middle w3-hide-large w3-hide-medium">
        {button('Slower')}
        {isRunning ? button('Stop') : button('Start')}
        {button('Faster')}
      </div>
      <div className="w3-cell w3-cell-middle">
          {button('Up')}
          <br />
          {button('Left')}
          <img className="fireball w3-spin" src={fireball} alt="fireball"/>
          {button('Right')}
          <br />
          {button('Down')}
      </div>
    </div>
    <div className="w3-cell-row w3-center w3-padding-16">
      <div className="w3-cell w3-hide-small">
        {button('Slower')}
        {isRunning ? button('Stop') : button('Start')}
        {button('Faster')}
      </div>
    </div>
  </>
  );
};

export default Navigation;
