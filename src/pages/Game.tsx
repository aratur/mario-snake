import React from 'react';
import GameBoard from '../features/GameBoard/GameBoard';
import Navigation from '../features/Navigation/Navigation';
import PlayGame from '../features/PlayGame/PlayGame';
import Points from '../features/Points/Points';
import Interval from '../features/Interval/Interval';

const Game = () => (
  <>
    <Points />
    <GameBoard />
    <Navigation />
    <PlayGame />
    <Interval />
  </>
);

export default Game;
