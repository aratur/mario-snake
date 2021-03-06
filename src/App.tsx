import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { resetStateThunk, changeNumberOfColumnsAndRowsThunk } from './store/store';
import { useTypedSelector } from './store/TypedUtils';
import {
  changeDirection, getLevel,
  getWasKilled,
  } from './store/snakeSlice';
import { getSize } from './store/columnsAndRowsSlice';
import Bricks from './Bricks';
import StatusBar from './StatusBar';
import Navigation from './Navigation';
import MoveOnInterval from './MoveOnInterval';
import KeyboardControlls from './KeyboardControlls';

function App() {

  const dispatch = useDispatch();
  const level = useTypedSelector(getLevel);
  const wasKilled = useTypedSelector(getWasKilled);
  const { numberOfRows, numberOfColumns } = useTypedSelector(getSize);
  const [isRunning, setIsRunning] = useState(false);
  const [componentDidMount, setComponentDidMount] = useState(true);

  const dispatchStart = useCallback(():void => {
    console.log("dispatchStart", wasKilled);
    if (wasKilled) {
      dispatch(resetStateThunk());
    }
      setIsRunning(true);
  }, [dispatch, wasKilled]);

  const stop = useCallback(():void => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (componentDidMount) {
      dispatch(changeNumberOfColumnsAndRowsThunk(
        window.innerHeight,
        window.innerWidth, true));
      setComponentDidMount(false);
    } else if (wasKilled && isRunning){
      stop();
    }
  }, [dispatch, stop, wasKilled,
    isRunning, componentDidMount]);

  const dispatchChangeDirection = (direction: string) => dispatch(changeDirection(direction));

  return <div className="w3-container">
    <KeyboardControlls
      dispatchChangeDirection={dispatchChangeDirection}
      dispatchStart={dispatchStart}
      stop={stop}
    />
    {isRunning ? <MoveOnInterval level={level}/> : null}
    <div className="w3-cell-row">
      <div className="w3-cell w3-margin-top w3-center w3-mobile w3-hide-small w3-cell-middle" >
      </div>
      <div className="w3-cell w3-mobile w3-center">
        <table className="w3-content">
          <tbody>
            <StatusBar numberOfColumns={numberOfColumns} />
            <Bricks numberOfColumns={numberOfColumns} numberOfRows={numberOfRows} />
          </tbody>
        </table>
        </div>
        <div className="w3-cell w3-margin-top w3-center w3-mobile w3-cell-middle">
          <Navigation
            start={dispatchStart}
            stop={stop}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
}

export default App;
