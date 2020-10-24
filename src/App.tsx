import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { coputeStateThunk, resetState } from './store/store';
import { useTypedSelector } from './store/TypedUtils';
import { columns, rows } from './model/ColumnsAndRows';
import {
  changeDirection, getLevel,
  getWasKilled, levelUp, levelDown,
  } from './store/snakeSlice';
import Box from './Box';
import StatusBar from './StatusBar';
import Navigation from './Navigation';

function App() {

  const dispatch = useDispatch();
  const level = useTypedSelector(getLevel);
  const wasKilled = useTypedSelector(getWasKilled);
  const [isRunning, setIsRunning] = useState(false);
  const [componentDidMount, setComponentDidMount] = useState(true);

  const dispatchStart = useCallback(():void => {
    console.log("dispatchStart", wasKilled);
    if (wasKilled) {
      // dispatch(setWasKilled(false));
      dispatch(resetState());
    }
      setIsRunning(true);
  }, [dispatch, wasKilled]);

  const stop = useCallback(():void => {
    setIsRunning(false);
  }, [dispatch]);
  const faster = ():void => {
    dispatch(levelUp());
  }
  const slower = ():void => {
    dispatch(levelDown());
  }

  const dispatchChangeDirection = useCallback((direction: string) =>{
    if (['Left','Right','Up','Down'].includes(direction))
      dispatch(changeDirection(direction));
  }, [dispatch]);

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
    console.log("useEffect", isRunning, wasKilled);
    let cleanup: NodeJS.Timer | undefined;
    if (componentDidMount) {
      dispatch(resetState());
      setComponentDidMount(false);
    } else if (wasKilled && isRunning){
      console.log("useEffect Stop")
      stop();
    } else if (isRunning){
      // https://evanshortiss.com/timers-in-typescript
      cleanup = setInterval(() => dispatch(coputeStateThunk()), 1000/level);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (cleanup) clearInterval(cleanup);
    }
  }, [dispatch, handleKeyDown, stop,
    wasKilled
    , isRunning, level, componentDidMount]);

  const renderBoxes = () => rows
    .map((row) => (
      <tr key={'row.' + String(row)}>
        {columns.map((column) => <Box
          column={column}
          row={row}
          key={ String(column * 100 +row) }
        />)}
      </tr>
    ));

  return <div className="w3-container">
    <div className="w3-cell-row">
      <div className="w3-cell w3-margin-top w3-center w3-mobile w3-hide-small w3-cell-middle" >
      <Navigation
        start={dispatchStart}
        stop={stop}
        isRunning={isRunning}
        changeDirection={dispatchChangeDirection}
        faster={faster}
        slower={slower}
        level={level}
      />
      </div>
      <div className="w3-cell w3-mobile w3-center">
        <table className="w3-content">
          <tbody>
            <StatusBar />
            {renderBoxes()}
          </tbody>
        </table>
        </div>
        <div className="w3-cell w3-margin-top w3-center w3-mobile w3-cell-middle" >
          <Navigation
            start={dispatchStart}
            stop={stop}
            isRunning={isRunning}
            changeDirection={dispatchChangeDirection}
            faster={faster}
            slower={slower}
            level={level}
          />
        </div>
      </div>
    </div>
}

export default App;
