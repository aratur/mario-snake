import React, { useEffect } from 'react';
import { useCustomStore } from '../../store/storeInstance';

/**
 * Updates global store's state on interval
 * Game component maintains internal iteration state
 * Game processes updates once global iteration
 * gets ahead of internal state
 */
const Interval = () => {
  const [{ iteration, isGameOver }, setIteration] = useCustomStore(
    ({ iteration, isGameOver }) => ({ iteration, isGameOver })
  );
  useEffect(() => {
    let isMounted = true;

    const intervalRef = setInterval(() => {
      if (isMounted && !isGameOver) setIteration({ iteration: iteration + 1 });
    }, 1000 / 3);
    return () => {
      isMounted = false;
      clearInterval(intervalRef);
    };
  }, [isGameOver, iteration, setIteration]);

  return <div />;
};

export default Interval;
