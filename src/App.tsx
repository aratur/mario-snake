import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import { coputeStateThunk, resetState } from './store/store';
import { useTypedSelector } from './store/TypedUtils';
import { columns, rows } from './model/ColumnsAndRows';
import {
  changeDirection, getLevel, setIsRestarting, getIsRestarting,
  getIsRunning, setIsRunning } from './store/snakeSlice';
import Box from './Box';
import StatusBar from './StatusBar';

function App() {

  const dispatch = useDispatch();
  const level = useTypedSelector(getLevel);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch(event.key) {
      case('ArrowLeft'):
        dispatch(changeDirection('Left'));
        break;
      case('ArrowRight'):
        dispatch(changeDirection('Right'));
        break;
      case('ArrowUp'):
        dispatch(changeDirection('Up'));
        break;
      case('ArrowDown'):
        dispatch(changeDirection('Down'));
        break;
      case('Enter'):
        dispatch(setIsRunning(true));
        break;
      case('Escape'):
        dispatch(setIsRunning(false));
        // dispatch(setIsRestarting(true));
        break;
      default:
        console.log(event.key);
    }
  }, [dispatch])

  const isRunning = useTypedSelector(getIsRunning);
  const isRestarting = useTypedSelector(getIsRestarting);
  const [componentDidMount, setComponentDidMount] = useState(true);

  useEffect(() => {
    if (componentDidMount) {
      dispatch(resetState());
      setComponentDidMount(false);
    } else if (isRestarting && isRunning){
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

  const handleButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const pressed = event.target as HTMLButtonElement;
    if (['Left','Right','Up','Down'].indexOf(pressed.value) > -1)
      dispatch(changeDirection(pressed.value));
    if (pressed.value === 'Stop') {
      dispatch(setIsRunning(false));
      dispatch(setIsRestarting(true));
    }
    if (pressed.value === 'Start') dispatch(setIsRunning(true));
  }

  const button = (name: string) => <button
    type="button"
    className="w3-button w3-teal"
    value={name}
    key={name}
    onClick={handleButtonClicked}>{name}</button>

  const renderBoxes = () => rows
    .map((row) => (
      <tr key={'row.' + String(row)}>
      {columns.map((column) => <Box column={column} row={row} key={ String(column * 100 +row) }/>)}
      </tr>
    ));

  return (
    <div className="w3-container">
        <div className="w3-row">
          <div className="w3-col m8 l9">
            <table>
              <tbody>
            <StatusBar />
            {renderBoxes()}
              </tbody>
            </table>
          </div>
          <div className="w3-col m4 l3" >
            {button('Start')}
            {button('Stop')}
            <br />
            {button('Up')}
            <br />
            {button('Left')}
            {button('Right')}
            <br />
            {button('Down')}
          </div>
      </div>
    </div>
  );
}

export default App;
