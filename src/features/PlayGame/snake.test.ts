import { Board, Coordinates, GameStore } from '../../model';
import {
  addNewCellToTheSnake,
  drawTheSnake,
  updateStateRemovingLastSnakeSegment,
} from './snake';

describe('Snake helper functions logic', () => {
  const initialGameState: GameStore = {
    iteration: 0,
    direction: 'right',
    position: { x: 5, y: 5 },
    snake: [{ x: 5, y: 5 }],
    prize: { x: 1, y: 1 },
    points: 0,
    board: new Map([['5|5', 'isHead']]),
    isGameOver: false,
  };

  describe('addNewCellToTheSnake', () => {
    it('should add a new cell to the beginning of the snake', () => {
      const initialSnake: Coordinates[] = [{ x: 1, y: 1 }];
      const newPosition: Coordinates = { x: 2, y: 1 };
      const newSnake = addNewCellToTheSnake(initialSnake, newPosition);

      expect(newSnake).toEqual([
        { x: 2, y: 1 },
        { x: 1, y: 1 },
      ]);
    });
  });

  describe('updateStateRemovingLastSnakeSegment', () => {
    it('should remove the last cell from the snake', () => {
      const gameState: GameStore = {
        ...initialGameState,
        snake: [
          { x: 5, y: 5 },
          { x: 6, y: 5 },
          { x: 7, y: 5 },
        ],
        board: new Map([
          ['5|5', 'isHead'],
          ['6|5', 'isTail'],
          ['7|5', 'isEmpty'],
        ]),
      };

      const updatedGameState = updateStateRemovingLastSnakeSegment(gameState);

      expect(updatedGameState.snake).toEqual([
        { x: 5, y: 5 },
        { x: 6, y: 5 },
      ]);
      expect(updatedGameState.board.get('7|5')).toEqual('isEmpty');
    });
  });

  describe('drawTheSnake', () => {
    it('should draw the snake onto the board', () => {
      const initialBoard: Board = new Map([
        ['5|5', 'isEmpty'],
        ['6|5', 'isEmpty'],
        ['7|5', 'isEmpty'],
      ]);
      const initialSnake: Coordinates[] = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 7, y: 5 },
      ];

      const newBoard = drawTheSnake(initialSnake, initialBoard);

      expect(newBoard.get('5|5')).toEqual('isHead');
      expect(newBoard.get('6|5')).toEqual('isTail');
      expect(newBoard.get('7|5')).toEqual('isTail');
    });
  });
});
