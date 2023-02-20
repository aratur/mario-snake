import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsScreenLocked, setIsScreenLocked } from './store/guiSlice';
import { changeNumberOfColumnsAndRowsThunk } from './store/store';
import screenLock from './img/screen-lock.svg';
import screenUnlock from './img/screen-unlock.svg';

const ResizeHandler = () => {
  const [timeout, updateTimeout] = useState<NodeJS.Timer | undefined>(
    undefined,
  );
  const [previousOrientation, setPreviousOrientation] = useState<
    string | number | undefined
  >(undefined);
  const waitFor = 300;
  const dispatch = useDispatch();
  const isScreenLocked = useSelector(getIsScreenLocked);

  const handleResizeAfterTimeout = useCallback(() => {
    if (isScreenLocked === false) {
      updateTimeout(undefined);
      dispatch(
        // @ts-ignore
        changeNumberOfColumnsAndRowsThunk(
          window.innerHeight,
          window.innerWidth,
        ),
      );
    }
  }, [isScreenLocked, dispatch]);

  const handleResizeEvent = useCallback(
    (event: UIEvent) => {
      event.stopPropagation();
      if (typeof timeout !== 'undefined') {
        clearTimeout(timeout);
      }
      if (typeof window.orientation !== 'undefined') {
        if (
          typeof previousOrientation === 'undefined' ||
          previousOrientation !== window.orientation
        ) {
          // if orientation property exists and value was changed
          const orientationDiff = Math.abs(
            Number(window.orientation) - Number(previousOrientation),
          );
          // visible screen elements taking up the screen space
          if (orientationDiff === 90) {
            // only when the screen was rotated by 90 degrees
            setPreviousOrientation(window.orientation);
          }
        }
      }
      updateTimeout(setTimeout(handleResizeAfterTimeout, waitFor));
    },
    [timeout, handleResizeAfterTimeout, previousOrientation],
  );

  const handleLockClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(setIsScreenLocked(!isScreenLocked));
  };

  useEffect(() => {
    if (isScreenLocked === false) {
      if (
        typeof previousOrientation === 'undefined' &&
        typeof window.orientation !== 'undefined'
      ) {
        setPreviousOrientation(window.orientation);
      }
      window.addEventListener('resize', handleResizeEvent);
      return () => {
        window.removeEventListener('resize', handleResizeEvent);
      };
    } else {
      window.removeEventListener('resize', handleResizeEvent);
    }
  }, [isScreenLocked, handleResizeEvent, previousOrientation]);

  return (
    <button className="navigation" onClick={handleLockClick}>
      <img
        onClick={handleLockClick}
        className="navigation"
        src={isScreenLocked ? screenUnlock : screenLock}
        alt={'fullscreen'}
      />
    </button>
  );
};

export default ResizeHandler;
