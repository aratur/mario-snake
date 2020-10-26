import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import { changeNumberOfColumnsAndRowsThunk } from './store/store';

const ResizeHandler = () => {
  // const [lastChanged, setLastChanged] = useState(Date.now());
  const [timeout, updateTimeout] = useState<NodeJS.Timer | undefined>(undefined);
  const [orientation, setOrientation] = useState<number | undefined>(undefined);
  const waitFor = 300;
  const dispatch = useDispatch();

  const handleResizeAfterTimeout = useCallback(() => {
    updateTimeout(undefined);
    console.log(window.innerHeight, window.outerHeight);
    if (typeof window.orientation !== "undefined"){
      setOrientation(Number(window.orientation));
    }
    dispatch(changeNumberOfColumnsAndRowsThunk(window.innerHeight, window.innerWidth));
  }, [dispatch]);

  const handleResizeEvent = useCallback((event: UIEvent) => {
    event.stopPropagation();
    if (typeof timeout !== "undefined") {
      clearTimeout(timeout);
    }
    updateTimeout(setTimeout(handleResizeAfterTimeout, waitFor));
  }, [timeout, handleResizeAfterTimeout]);

  useEffect(() => {
    if (typeof orientation === "undefined"
      && typeof window.orientation !== "undefined") {
      setOrientation(Number(window.orientation));
    }
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener('resize', handleResizeEvent);
    }
  }, [handleResizeEvent, orientation]);
  return <p>{orientation}</p>;
}

export default ResizeHandler;
