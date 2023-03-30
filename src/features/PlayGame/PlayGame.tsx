import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deepCopyState, useCustomStore } from '../../store/storeInstance';
import {
  checkForBrickCollision,
  checkIfThereAreAnyBricksLeft,
  updateStateWhenThereAreNoMoreBricks,
} from './bricks';
import { checkForPrizeCollision, checkIfGameOver } from './collisions';
import { move } from './move';
import {
  drawPrize,
  updatePrizeIfNotSet,
  updateStateCollidedWithPrize,
} from './prize';
import {
  addNewCellToTheSnake,
  drawTheSnake,
  updateStateRemovingLastSnakeSegment,
} from './snake';
import { GameStore } from '../../model';

const PlayGame = () => {
  const [state, setState] = useCustomStore((store) => store);
  const navigate = useNavigate();
  const [prevIteration, setIteration] = useState(0);

  const updateInternalIterationState = useCallback(() => {
    if (prevIteration < state.iteration) {
      setIteration(state.iteration);
    }
  }, [prevIteration, state.iteration]);

  const canMove =
    state.direction !== 'pause' &&
    !state.isGameOver &&
    prevIteration < state.iteration;

  const updateStateBasedOnTheNewPosition = (state: GameStore) => {
    let newState = deepCopyState(state);
    newState.snake = addNewCellToTheSnake(newState.snake, newState.position);
    if (checkForPrizeCollision(newState.position, newState.prize)) {
      newState = updateStateCollidedWithPrize(newState);
    } else {
      newState = updateStateRemovingLastSnakeSegment(newState);
    }
    if (checkForBrickCollision(newState.position, newState.board)) {
      newState.points += 1;
    }
    if (!checkIfThereAreAnyBricksLeft(newState.board)) {
      newState = updateStateWhenThereAreNoMoreBricks(newState);
    }
    newState.board = drawTheSnake(newState.snake, newState.board);
    newState.prize = updatePrizeIfNotSet(newState.snake, newState.prize);
    newState.board = drawPrize(newState.prize, newState.board);
    return newState;
  };

  useEffect(() => {
    let isMounted = true;
    updateInternalIterationState();

    if (canMove) {
      let newState = deepCopyState(state);

      newState.position = move(newState.direction, newState.position);

      if (checkIfGameOver(newState.position, newState.snake)) {
        newState.direction = 'pause';
        newState.isGameOver = true;
        navigate('/gameOver');
      } else {
        newState = updateStateBasedOnTheNewPosition(newState);
      }

      const { iteration, ...rest } = newState;
      if (isMounted) setState(rest);
    }

    return () => {
      isMounted = false;
    };
  }, [
    canMove,
    navigate,
    prevIteration,
    setState,
    state,
    updateInternalIterationState,
  ]);

  return <div />;
};

export default PlayGame;
