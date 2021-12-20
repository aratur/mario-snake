import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { coputeStateThunk } from './store/store';

type Props = { level: number };
const MoveOnInterval = ({ level }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    let cleanup: NodeJS.Timer | undefined;
    // console.log("delay" + 1400/level)
    // https://evanshortiss.com/timers-in-typescript
    cleanup = setInterval(() => dispatch(coputeStateThunk()), 1400/level);
    return () => {
       if (cleanup) clearInterval(cleanup);
    }
  }, [dispatch, level]);
  return null;
}

export default MoveOnInterval;
