import {useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import { changeNumberOfColumnsAndRowsThunk } from './store/store';

const ResizeHandler = () => {
  const [timeout, updateTimeout] = useState<NodeJS.Timer | undefined>(undefined);
  const [previousOrientation, setPreviousOrientation] = useState<string | number | undefined>(undefined);
  const waitFor = 300;
  const dispatch = useDispatch();

  const handleResizeAfterTimeout = useCallback(() => {
    updateTimeout(undefined);
    dispatch(changeNumberOfColumnsAndRowsThunk(window.innerHeight, window.innerWidth));
  }, [dispatch]);

  const handleResizeEvent = useCallback((event: UIEvent) => {
    event.stopPropagation();
    if (typeof timeout !== "undefined") {
      clearTimeout(timeout);
    }
    if (typeof window.orientation !== "undefined"){
      if (typeof previousOrientation === "undefined"
          || previousOrientation !== window.orientation){
        // if orientation property exists and value was changed
        const orientationDiff = Math.abs(Number(window.orientation) - Number(previousOrientation));
        // visible screen elements taking up the screen space
        if (orientationDiff === 90) {
          // only when the screen was rotated by 90 degrees
          const behavior: 'auto' = 'auto';
          window.scrollTo({ left: 500, top: 500, behavior });
          window.scrollTo({ left: 0, top: 0, behavior });
          setPreviousOrientation(window.orientation);
        }
      }
    }
    updateTimeout(setTimeout(handleResizeAfterTimeout, waitFor));
  }, [timeout, handleResizeAfterTimeout, previousOrientation]);

  useEffect(() => {
    if (typeof previousOrientation === "undefined"
      && typeof window.orientation !== "undefined") {
      setPreviousOrientation(window.orientation);
    }
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener('resize', handleResizeEvent);
    }
  }, [handleResizeEvent, previousOrientation]);
  return null;
}

export default ResizeHandler;
