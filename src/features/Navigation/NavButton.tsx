/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import arrowUp from '../../assets/navigation/arrow-up.svg';
import arrowDown from '../../assets/navigation/arrow-down.svg';
import arrowLeft from '../../assets/navigation/arrow-left.svg';
import arrowRight from '../../assets/navigation/arrow-right.svg';
import play from '../../assets/navigation/play.svg';
import pause from '../../assets/navigation/pause.svg';

interface Props extends React.ComponentPropsWithRef<'button'> {
  variant: 'left' | 'right' | 'up' | 'down' | 'play' | 'pause';
  direction: 'left' | 'right' | 'up' | 'down' | 'pause';
}

const NavButton = (props: Props) => {
  const { variant, direction, ...otherProps } = props;

  const getIcon = () => {
    switch (variant) {
      case 'down':
        return arrowDown;
      case 'up':
        return arrowUp;
      case 'left':
        return arrowLeft;
      case 'right':
        return arrowRight;
      case 'play':
        return play;
      case 'pause':
        return pause;
      default:
        return arrowDown;
    }
  };
  return (
    <button
      type="button"
      data-is-pressed={direction === variant}
      data-variant={variant}
      {...otherProps}
    >
      <img src={getIcon()} alt={variant} />
    </button>
  );
};

export default NavButton;
