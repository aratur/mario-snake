import { Board } from './Board';
import { Coordinates } from './Coordinates';
import { Direction } from './Direction';

export interface GameStore {
  iteration: number;
  direction: Direction;
  position: Coordinates;
  snake: Array<Coordinates>;
  prize: Coordinates;
  points: number;
  board: Board;
  isGameOver: boolean;
}
