import React, { useMemo } from 'react';
import { COLS, ROWS } from '../../store/storeInstance';
import BoardItem from './BoardItem';
import style from './game-board.module.scss';

type Props = {
  numberOfRows?: number;
  numberOfColumns?: number;
};
const GameBoard = ({ numberOfRows = ROWS, numberOfColumns = COLS }: Props) => {
  const memoRenderBricks = useMemo(
    () =>
      Array(numberOfRows)
        .fill(0)
        .map((_, index) => index)
        .map((row) => (
          <div className={style['game-board__row']} key={`row_${row}`}>
            {Array(numberOfColumns)
              .fill(0)
              .map((_, index) => index)
              .map((column) => (
                <BoardItem x={column} y={row} key={`${column * 100}_${row}`} />
              ))}
          </div>
        )),
    [numberOfRows, numberOfColumns]
  );

  return <div className={style['game-board']}>{memoRenderBricks}</div>;
};

export default GameBoard;
