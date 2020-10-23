import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { coputeStateThunk, resetState } from './store/store';
import { useTypedSelector } from './store/TypedUtils';
import { columns, rows } from './model/ColumnsAndRows';
import {
  changeDirection, getLevel, getIsRestarting,
  getIsRunning, setIsRunning } from './store/snakeSlice';
import Box from './Box';
import StatusBar from './StatusBar';
import Navigation from './Navigation';

function App() {

  const dispatch = useDispatch();
  const level = useTypedSelector(getLevel);

  const dispatchStart = useCallback(() => {
    dispatch(setIsRunning(true));
  }, [dispatch]);

  const dispatchStop = useCallback(() => {
    dispatch(setIsRunning(false));
  }, [dispatch]);

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
      case('Escape'): dispatchStop (); break;
      default: console.log(event.key);
    }
  }, [dispatchChangeDirection, dispatchStart, dispatchStop])

  const isRunning = useTypedSelector(getIsRunning);
  const isRestarting = useTypedSelector(getIsRestarting);
  const [componentDidMount, setComponentDidMount] = useState(true);

  useEffect(() => {
    if (componentDidMount) {
      dispatch(resetState());
      setComponentDidMount(false);
    } else if (isRestarting){
      dispatch(resetState());
    }
    // https://evanshortiss.com/timers-in-typescript
    let cleanup: NodeJS.Timer | undefined;
    if (isRunning){
      cleanup = setInterval(() => dispatch(coputeStateThunk()), 500/level)
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (cleanup) clearInterval(cleanup);
    }
  }, [dispatch, handleKeyDown, isRunning, level, isRestarting, componentDidMount]);

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
        <Navigation start={dispatchStart} stop={dispatchStop} isRunning={isRunning} changeDirection={dispatchChangeDirection}/>
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
          <Navigation start={dispatchStart} stop={dispatchStop} isRunning={isRunning} changeDirection={dispatchChangeDirection}/>
        </div>
      </div>
    </div>
}

export default App;
