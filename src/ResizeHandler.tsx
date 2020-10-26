import {useEffect, useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import { changeNumberOfColumnsAndRowsThunk } from './store/store';

const ResizeHandler = () => {
  // const [lastChanged, setLastChanged] = useState(Date.now());
  const [timeout, updateTimeout] = useState<NodeJS.Timer | undefined>(undefined);
  const waitFor = 300;
  const dispatch = useDispatch();

  const handleResizeAfterTimeout = useCallback(() => {
    updateTimeout(undefined);
    console.log(window.innerHeight, window.outerHeight);
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
    window.addEventListener("resize", handleResizeEvent);
    return () => {
      window.removeEventListener('resize', handleResizeEvent);
    }
  }, [handleResizeEvent]);
  return null;
}

export default ResizeHandler;
