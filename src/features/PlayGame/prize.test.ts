import { Board, Coordinates } from '../../model';
import { COLS, initialPrize, ROWS } from '../../store/storeInstance';
import { updatePrizeIfNotSet, getPrize, drawPrize } from './prize';

describe('updatePrizeIfNotSet', () => {
  it('should return a new prize if the prize is set to the initial position', () => {
    const snake: Coordinates[] = [{ x: 1, y: 1 }];
    const prize = updatePrizeIfNotSet(snake, initialPrize);
    expect(prize).not.toEqual(initialPrize);
    expect(prize.x).toBeGreaterThanOrEqual(1);
    expect(prize.x).toBeLessThanOrEqual(COLS - 2);
    expect(prize.y).toBeGreaterThanOrEqual(1);
    expect(prize.y).toBeLessThanOrEqual(ROWS - 2);
  });

  it('should return the same prize if the prize is not set to the initial position', () => {
    const snake: Coordinates[] = [{ x: 1, y: 1 }];
    const prize: Coordinates = { x: 5, y: 5 };
    const newPrize = updatePrizeIfNotSet(snake, prize);
    expect(newPrize).toEqual(prize);
  });
});

describe('getPrize', () => {
  it('should return a random set of coordinates that is not part of the snake', () => {
    const snake: Coordinates[] = [{ x: 1, y: 1 }];
    const prize = getPrize(snake);
    expect(prize.x).toBeGreaterThanOrEqual(1);
    expect(prize.x).toBeLessThanOrEqual(COLS - 2);
    expect(prize.y).toBeGreaterThanOrEqual(1);
    expect(prize.y).toBeLessThanOrEqual(ROWS - 2);
    expect(snake.some((c) => c.x === prize.x && c.y === prize.y)).toBe(false);
  });
});

describe('drawPrize', () => {
  it('should return a new board with the prize drawn on it', () => {
    const prize: Coordinates = { x: 5, y: 5 };
    const board: Board = new Map();
    const newBoard = drawPrize(prize, board);
    expect(newBoard.get('5|5')).toBe('isPrize');
  });
});
