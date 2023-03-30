import { Coordinates } from '../../model';
import { COLS, ROWS } from '../../store/storeInstance';

// Check for collisions with the walls
const checkForWallCollisions = (position: Coordinates) => {
  return position.x < 1 ||
    position.x >= COLS - 1 ||
    position.y < 1 ||
    position.y >= ROWS - 1
    ? true
    : false;
};

// Check for collisions with the snake
const checkForSnakeCollisions = (
  position: Coordinates,
  snake: Coordinates[]
) => {
  return snake.some((s) => s.x === position.x && s.y === position.y);
};

// Check for collisions with the prize
const checkForPrizeCollision = (position: Coordinates, prize: Coordinates) => {
  return position.x === prize.x && position.y === prize.y ? true : false;
};

const checkIfGameOver = (position: Coordinates, snake: Coordinates[]) => {
  const collidedWithTheWall = checkForWallCollisions(position);
  const collidedWithTheSnake = checkForSnakeCollisions(position, snake);
  return collidedWithTheWall || collidedWithTheSnake;
};

export { checkForPrizeCollision, checkIfGameOver };
