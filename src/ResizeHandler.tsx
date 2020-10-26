import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import { changeNumberOfColumnsAndRowsThunk } from './store/store';

const ResizeHandler = () => {
  // const [lastChanged, setLastChanged] = useState(Date.now());
  const [timeout, updateTimeout] = useState<NodeJS.Timer | undefined>(undefined);
  const [previousOrientation, setPreviousOrientation] = useState<string | number | undefined>(undefined);
  const [previousWidth, setPreviousWidth] = useState<number | undefined>(undefined);
  const [previousHeight, setPreviousHeight] = useState<number | undefined>(undefined);
  const waitFor = 300;
  const dispatch = useDispatch();

  const handleResizeAfterTimeout = useCallback(() => {
    updateTimeout(undefined);
    let heightToBeUsed = window.innerHeight;
    let widthToBeUsed = window.innerWidth;
    if (typeof window.orientation !== "undefined"){
      if (typeof previousOrientation === "undefined"
          || previousOrientation !== window.orientation){
        // if orientation property exists and value was changed
        const orientationDiff = Math.abs(Number(window.orientation) - Number(previousOrientation));
        if (orientationDiff === 90) {
          // only when the screen was rotated by 90 degrees
          // override window width and height if screen was rotated
          heightToBeUsed = previousWidth ? previousWidth : window.innerHeight;
          widthToBeUsed = previousHeight ? previousHeight : window.innerWidth;
          // update state
          setPreviousOrientation(window.orientation);
          setPreviousWidth(previousHeight);
          setPreviousHeight(previousWidth);
        }
      }
    }
    dispatch(changeNumberOfColumnsAndRowsThunk(heightToBeUsed, widthToBeUsed));
  }, [dispatch, previousWidth, previousHeight, previousOrientation]);

  const handleResizeEvent = useCallback((event: UIEvent) => {
    event.stopPropagation();
    if (typeof timeout !== "undefined") {
      clearTimeout(timeout);
    }
    updateTimeout(setTimeout(handleResizeAfterTimeout, waitFor));
  }, [timeout, handleResizeAfterTimeout]);

  useEffect(() => {
    if (typeof previousOrientation === "undefined"
      && typeof window.orientation !== "undefined") {
      setPreviousOrientation(window.orientation);
    }
    if (typeof previousWidth === "undefined") {
      setPreviousWidth(window.innerWidth);
    }
    if (typeof previousHeight === "undefined") {
      setPreviousHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener('resize', handleResizeEvent);
    }
  }, [handleResizeEvent, previousOrientation, previousWidth, previousHeight]);
  return <p>{previousOrientation + "." + previousHeight + "." + window.innerHeight}</p>;
}

export default ResizeHandler;
