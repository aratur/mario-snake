import React, { useMemo, useCallback }  from 'react';
import fireball from './img/fireball.png';
import NavigationButton from './NavigationButton';
import FullScreenButton from './FullScreenButton';

type Props = {
  start: () => void,
  stop: () => void,
  isRunning: boolean,
};

const Navigation = ( { start, stop, isRunning } : Props) => {

  const button = useCallback((name: string) => <NavigationButton
    name={name}
    start={start}
    stop={stop} />, [start, stop]);


  const renderSettings = useMemo(() => <>
    {button('Slower')}
    {button('Faster')}
    <br />
    <FullScreenButton />
    {isRunning ? button('Stop') : button('Start')}
  </>, [isRunning, button]);

  const memoRender = useMemo(()=> <>
  <div className="w3-cell-row"  >
    <div className="w3-cell w3-cell-middle w3-hide-large w3-hide-medium">
      {renderSettings}
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
  <div className="w3-cell-row w3-center w3-padding-16 w3-hide-small">
    {renderSettings}
  </div>
  </>, [renderSettings, button]);

  return <>{memoRender}</>;
};

export default Navigation;
