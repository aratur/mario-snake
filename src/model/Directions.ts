import Coordinates from './Coordinates';
// type direction = 'Left' | 'Right' | 'Up' | 'Down';
export type Directions = { [direction: string]: Coordinates,};

const directions: Directions = {
  Left: { column: -1, row: 0 },
  Right: { column: 1, row: 0 },
  Up: { column: 0, row: -1 },
  Down: { column: 0, row: 1 },
};

export default directions;
