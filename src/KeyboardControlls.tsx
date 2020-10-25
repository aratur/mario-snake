import { useEffect, useCallback } from 'react';

type Props = {
  dispatchChangeDirection: (direction: string) => void,
  dispatchStart: () => void,
  stop: () => void,
}
const KeyboardControlls = ({dispatchChangeDirection, dispatchStart, stop} : Props) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch(event.key) {
      case('ArrowLeft'):
        dispatchChangeDirection('Left');
        break;
      case('ArrowRight'):
        dispatchChangeDirection('Right');
        break;
      case('ArrowUp'):
        dispatchChangeDirection('Up');
        break;
      case('ArrowDown'): dispatchChangeDirection('Down');
        break;
      case('Enter'): dispatchStart(); break;
      case('Escape'): stop (); break;
      default: console.log(event.key);
    }
  }, [dispatchChangeDirection, dispatchStart, stop])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown])
  return null;
}

export default KeyboardControlls;
