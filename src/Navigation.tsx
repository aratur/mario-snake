import React from 'react';
import arrowUp from './img/arrow-up.svg';
import arrowDown from './img/arrow-down.svg';
import arrowLeft from './img/arrow-left.svg';
import arrowRight from './img/arrow-right.svg';
import play from './img/play.svg';
import pause from './img/pause.svg';
import fireball from './img/fireball.png';

type Props = {
  start: () => void,
  stop: () => void,
  isRunning: boolean,
  changeDirection: (direction: string) => void
};

const Navigation = ( { start, stop, isRunning, changeDirection } : Props) => {
  const handleButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const pressed = event.target as HTMLElement;
    let name = "unknown";
    if (pressed.hasAttribute("alt")) {
      name = (event.target as HTMLImageElement).alt;
    } else {
      name = (event.target as HTMLButtonElement).value;
    }
    if (['Left','Right','Up','Down'].includes(name))
      changeDirection(name);
    if (name === 'Stop') stop();
    if (name === 'Start') start();
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
        />
      </button>
  }

  return (
  <>
    <div className="w3-cell-row" >
      <div className="w3-cell w3-cell-middle w3-hide-large w3-hide-medium">
        {isRunning ? button('Stop') : button('Start')}
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
        {isRunning ? button('Stop') : button('Start')}
      </div>
    </div>
  </>
  );
};

export default Navigation;
