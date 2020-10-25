import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { resetState } from './store/store';
import { useTypedSelector } from './store/TypedUtils';
import {
  changeDirection, getLevel,
  getWasKilled,
  } from './store/snakeSlice';
import Bricks from './Bricks';
import StatusBar from './StatusBar';
import Navigation from './Navigation';
import MoveOnInterval from './MoveOnInterval';
import ResizeHandler from './ResizeHandler';
import KeyboardControlls from './KeyboardControlls';
import { columns, rows } from './model/ColumnsAndRows';

function App() {

  const dispatch = useDispatch();
  const level = useTypedSelector(getLevel);
  const wasKilled = useTypedSelector(getWasKilled);
  const [isRunning, setIsRunning] = useState(false);
  const [componentDidMount, setComponentDidMount] = useState(true);

  const dispatchStart = useCallback(():void => {
    console.log("dispatchStart", wasKilled);
    if (wasKilled) {
      dispatch(resetState());
    }
      setIsRunning(true);
  }, [dispatch, wasKilled]);

  const stop = useCallback(():void => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (componentDidMount) {
      dispatch(resetState());
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
    <ResizeHandler />
    {isRunning ? <MoveOnInterval level={level}/> : null}
    <div className="w3-cell-row">
      <div className="w3-cell w3-margin-top w3-center w3-mobile w3-hide-small w3-cell-middle" >
      </div>
      <div className="w3-cell w3-mobile w3-center">
        <table className="w3-content">
          <tbody>
            <StatusBar />
            <Bricks columns={columns} rows={rows} />
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
