import React, { useCallback } from 'react';
import wall from '../../assets/board/mario-wall.png';
import bricks from '../../assets/board/mario-bricks.svg';
import coin from '../../assets/prize.svg';
import head from '../../assets/board/mario.png';
import body from '../../assets/board/mushroom.svg';
import { useCustomStore } from '../../store/storeInstance';

type Props = {
  x: number;
  y: number;
};

const BoardItem = (props: Props): React.ReactElement => {
  const { x, y } = props;
  const boardItemKey = [x, y].join('|');
  const [status] = useCustomStore(({ board }) => board.get(boardItemKey));

  const switchStatus = useCallback(() => {
    switch (status) {
      case 'isWall':
        return <img src={wall} alt={status} />;
      case 'isBrick':
        return <img src={bricks} alt={status} />;
      case 'isHead':
        return <img src={head} alt={status} />;
      case 'isPrize':
        return <img src={coin} alt={status} />;
      case 'isTail':
        return <img src={body} alt={status} />;
      case 'isEmpty':
        return <span className="empty"> </span>;
      default:
        return <span>Unknown tag</span>;
    }
  }, [status]);

  return switchStatus();
};

export default BoardItem;
