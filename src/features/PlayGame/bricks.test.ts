import { GameStore, GridItem } from '../../model';
import { initialBoard, initialSnake } from '../../store/storeInstance';
import {
  checkForBrickCollision,
  checkIfThereAreAnyBricksLeft,
  updateStateWhenThereAreNoMoreBricks,
} from './bricks';

describe('checkForBrickCollision', () => {
  it('returns true if there is a brick at the given position', () => {
    const board = new Map<string, GridItem>();
    board.set('0|0', 'isEmpty');
    board.set('0|1', 'isBrick');
    board.set('0|2', 'isEmpty');

    const position = { x: 0, y: 1 };

    expect(checkForBrickCollision(position, board)).toBe(true);
  });

  it('returns false if there is no brick at the given position', () => {
    const board = new Map<string, GridItem>();
    board.set('0|0', 'isEmpty');
    board.set('0|1', 'isEmpty');
    board.set('0|2', 'isEmpty');

    const position = { x: 0, y: 1 };

    expect(checkForBrickCollision(position, board)).toBe(false);
  });
});

describe('checkIfThereAreAnyBricksLeft', () => {
  it('returns true if there is at least one brick in the board', () => {
    const board = new Map<string, GridItem>();
    board.set('0|0', 'isEmpty');
    board.set('0|1', 'isBrick');
    board.set('0|2', 'isEmpty');

    expect(checkIfThereAreAnyBricksLeft(board)).toBe(true);
  });

  it('returns false if there are no bricks in the board', () => {
    const board = new Map<string, GridItem>();
    board.set('0|0', 'isEmpty');
    board.set('0|1', 'isEmpty');
    board.set('0|2', 'isEmpty');

    expect(checkIfThereAreAnyBricksLeft(board)).toBe(false);
  });
});

describe('updateStateWhenThereAreNoMoreBricks', () => {
  const initialState: GameStore = {
    iteration: 0,
    direction: 'right',
    position: { x: 1, y: 1 },

    snake: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
    prize: { x: 2, y: 1 },
    points: 0,
    board: new Map<string, GridItem>(),
    isGameOver: false,
  };

  it('returns a new state with initial values when there are no more bricks except points and iterations', () => {
    const mockState: GameStore = {
      ...initialState,
      points: 932,
      iteration: 123,
    };
    const updatedState = updateStateWhenThereAreNoMoreBricks({
      ...mockState,
      board: new Map<string, GridItem>([
        ['0|0', 'isEmpty'],
        ['0|1', 'isEmpty'],
        ['0|2', 'isEmpty'],
      ]),
    });

    expect(updatedState.iteration).toEqual(123);
    expect(updatedState.points).toEqual(932);
    expect(updatedState.board).toEqual(initialBoard);
  });
});
