import { Board, Coordinates, GameStore } from '../../model';
import { initialBoard, initialSnake } from '../../store/storeInstance';

export const checkForBrickCollision = (position: Coordinates, board: Board) => {
  const tile = board.get([position.x, position.y].join('|'));
  if (tile === 'isBrick') return true;
  return false;
};

export const checkIfThereAreAnyBricksLeft = (board: Board) => {
  let noOfBricks = 0;
  board.forEach((entry) => {
    if (entry === 'isBrick') noOfBricks++;
  });
  return noOfBricks > 0;
};

export const updateStateWhenThereAreNoMoreBricks = (
  state: GameStore
): GameStore => {
  return {
    ...state,
    board: initialBoard,
    snake: initialSnake,
    position: initialSnake[0],
  };
};
