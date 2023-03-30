import { checkForPrizeCollision, checkIfGameOver } from './collisions';

describe('checkForPrizeCollision', () => {
  it('returns true when position matches prize', () => {
    const position = { x: 2, y: 3 };
    const prize = { x: 2, y: 3 };
    expect(checkForPrizeCollision(position, prize)).toBe(true);
  });
  it('returns false when position does not match prize', () => {
    const position = { x: 2, y: 3 };
    const prize = { x: 4, y: 5 };
    expect(checkForPrizeCollision(position, prize)).toBe(false);
  });
});

describe('checkIfGameOver', () => {
  it('returns true when position collides with the wall', () => {
    const position = { x: 0, y: 3 };
    const snake = [{ x: 1, y: 3 }];
    expect(checkIfGameOver(position, snake)).toBe(true);
  });

  it('returns true when position collides with the snake', () => {
    const position = { x: 2, y: 3 };
    const snake = [
      { x: 2, y: 3 },
      { x: 1, y: 3 },
    ];
    expect(checkIfGameOver(position, snake)).toBe(true);
  });

  it('returns false when position does not collide with the wall or snake', () => {
    const position = { x: 2, y: 3 };
    const snake = [{ x: 1, y: 3 }];
    expect(checkIfGameOver(position, snake)).toBe(false);
  });
});
