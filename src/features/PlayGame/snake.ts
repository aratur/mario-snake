import { Coordinates, GameStore, GridItem } from '../../model';

// Add a new cell to the snake
export const addNewCellToTheSnake = (
  snake: Coordinates[],
  position: Coordinates
) => {
  snake.unshift({ x: position.x, y: position.y });
  return snake;
};

// Remove the last cell because it doesn't grow
export const updateStateRemovingLastSnakeSegment = (
  state: GameStore
): GameStore => {
  const removed = state.snake.pop()!;
  const removedKey = [removed.x, removed.y].join('|');
  state.board.set(removedKey, 'isEmpty');
  return state;
};

// Draw the snake
export const drawTheSnake = (
  snake: Coordinates[],
  board: Map<string, GridItem>
) => {
  const snakeLength = snake.length;
  const newBoard = new Map(board);
  snake.forEach((segment, index) => {
    let bodyPart: GridItem = 'isTail';
    if (index === 0) bodyPart = 'isHead';
    else if (index === snakeLength - 1) bodyPart = 'isTail';
    newBoard.set([segment.x, segment.y].join('|'), bodyPart);
  });
  return newBoard;
};
