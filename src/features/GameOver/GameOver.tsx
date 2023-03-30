import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitialState, useCustomStore } from '../../store/storeInstance';
import style from './game-over.module.scss';

const GameOver = () => {
  const [isGameOver, setIsGameOver] = useCustomStore(
    ({ isGameOver }) => isGameOver
  );
  const navigate = useNavigate();

  const resetGame = () => {
    if (isGameOver) {
      const { iteration, ...rest } = getInitialState();
      setIsGameOver(rest);
    }
    navigate('/');
  };

  return (
    <div className={style['game-over']}>
      <p>Game Over!</p>
      <button type="button" onClick={resetGame}>
        Try again
      </button>
    </div>
  );
};

export default GameOver;
