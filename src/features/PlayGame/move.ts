import { Coordinates, Direction } from '../../model';

const controls = {
  up: { xDirection: 0, yDirection: -1 },
  down: { xDirection: 0, yDirection: 1 },
  left: { xDirection: -1, yDirection: 0 },
  right: { xDirection: 1, yDirection: 0 },
  pause: { xDirection: 0, yDirection: 0 },
};

// Move the snake
export const move = (
  direction: Direction,
  position: Coordinates
): Coordinates => {
  const { xDirection, yDirection } = controls[direction];
  return {
    x: position.x + xDirection,
    y: position.y + yDirection,
  };
};
