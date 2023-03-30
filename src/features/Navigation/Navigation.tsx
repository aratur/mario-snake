import React from 'react';
import NavButton from './NavButton';
import useDirection from './useDirection';
import style from './navigation.module.scss';

const Navigation = () => {
  const { direction, turnLeft, turnRight, turnDown, turnUp, toggleStatus } =
    useDirection();
  return (
    <div className={style.nav}>
      <NavButton
        className={style.nav__btn}
        type="button"
        variant={direction === 'pause' ? 'pause' : 'play'}
        direction={direction}
        onClick={toggleStatus}
      />
      <div className={style.nav__controls}>
        <NavButton
          className={style.nav__btn}
          type="button"
          variant="up"
          direction={direction}
          onClick={turnUp}
        />
        <NavButton
          className={style.nav__btn}
          type="button"
          variant="left"
          direction={direction}
          onClick={turnLeft}
        />
        <NavButton
          className={style.nav__btn}
          type="button"
          variant="right"
          direction={direction}
          onClick={turnRight}
        />
        <NavButton
          className={style.nav__btn}
          type="button"
          variant="down"
          direction={direction}
          onClick={turnDown}
        />
      </div>
    </div>
  );
};

export default Navigation;
