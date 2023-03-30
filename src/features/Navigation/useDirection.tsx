import { useCallback, useEffect, useRef } from 'react';
import { useCustomStore } from '../../store/storeInstance';

const initialDirection = 'right';

const useDirection = () => {
  const [direction, setDirection] = useCustomStore(
    ({ direction }) => direction
  );
  type Direction = typeof direction;
  const prevDirection = useRef<Direction>(initialDirection);

  const prevNotEqualTo = useCallback(
    (value: Direction) => !(direction === value),
    [direction]
  );

  const turnLeft = useCallback(() => {
    if (prevNotEqualTo('right')) {
      setDirection({ direction: 'left' });
    }
  }, [prevNotEqualTo, setDirection]);

  const turnUp = useCallback(() => {
    if (prevNotEqualTo('down')) {
      setDirection({ direction: 'up' });
    }
  }, [prevNotEqualTo, setDirection]);

  const turnRight = useCallback(() => {
    if (prevNotEqualTo('left')) {
      setDirection({ direction: 'right' });
    }
  }, [prevNotEqualTo, setDirection]);

  const turnDown = useCallback(() => {
    if (prevNotEqualTo('up')) {
      setDirection({ direction: 'down' });
    }
  }, [prevNotEqualTo, setDirection]);

  const pauseGame = useCallback(() => {
    if (direction !== 'pause') prevDirection.current = direction;
    setDirection({ direction: 'pause' });
  }, [setDirection, direction]);

  const toggleStatus = useCallback(() => {
    if (direction === 'pause') {
      setDirection({ direction: prevDirection.current });
    } else {
      pauseGame();
    }
  }, [pauseGame, setDirection, direction]);

  const changeDirection = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.code) {
        case 'ArrowLeft':
          turnLeft();
          break;
        case 'ArrowUp':
          turnUp();
          break;
        case 'ArrowRight':
          turnRight();
          break;
        case 'ArrowDown':
          turnDown();
          break;
        case 'Space':
        case 'Enter':
        case 'NumpadEnter':
          toggleStatus();
          break;
        case 'Escape':
          pauseGame();
          break;
        default:
          break;
      }
    },
    [turnLeft, turnUp, turnRight, turnDown, toggleStatus, pauseGame]
  );

  useEffect(() => {
    document.addEventListener('keydown', changeDirection);
    return () => document.removeEventListener('keydown', changeDirection);
  }, [changeDirection]);

  return {
    direction,
    turnDown,
    turnLeft,
    turnRight,
    turnUp,
    toggleStatus,
    pauseGame,
  };
};

export default useDirection;
