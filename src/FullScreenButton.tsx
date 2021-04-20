import React, { useEffect, useState } from 'react';
import screenfull, {Screenfull} from 'screenfull';
import fullscreenEnable from './img/fullscreen-enable.svg';
import fullscreenExit from './img/fullscreen-exit.svg';

const FullScreenButton = () => {

  const checkIsFullscreen = (): boolean => {
    if (screenfull.isEnabled) return screenfull.isFullscreen
    return false
  }

  const [isFullscreen, setIsFullscreen] = useState(checkIsFullscreen());

  useEffect(() => {
    if (screenfull.isEnabled) {
      console.log("FS enable adding event...");
      const eScreenfull: Screenfull = screenfull;
      const handleFullScreenChange = () => {
        console.log('Am I fullscreen?'
        , eScreenfull.isFullscreen ? 'Yes' : 'No');
        if (isFullscreen !== eScreenfull.isFullscreen)
          setIsFullscreen(eScreenfull.isFullscreen);
      }
      eScreenfull.on('change', handleFullScreenChange);
      return () => eScreenfull.off('change', handleFullScreenChange);
    }
  }, [isFullscreen]);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("czy screenfull is enabled ", screenfull.isEnabled);
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  // style={screenfull.isEnabled ? { visibility: 'hidden'} : {}}

  return <button
    className="navigation"
    onClick={handleClick}
    ><img
      onClick={handleClick}
      className="navigation"
      src={isFullscreen ? fullscreenExit : fullscreenEnable}
      alt={'fullscreen'}
    /></button>
};

export default FullScreenButton;
