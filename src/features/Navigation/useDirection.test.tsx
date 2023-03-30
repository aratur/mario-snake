import React from 'react';
import { renderHook, act } from '@testing-library/react';
import TestStoreProvider from '../../tests';
import useDirection from './useDirection';

describe('useDirection', () => {
  it('returns initial direction', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    expect(result.current.direction).toEqual('pause');
  });

  it('changes direction to left', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    act(() => {
      result.current.turnLeft();
    });
    expect(result.current.direction).toEqual('left');
  });
  it('changes direction to up', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    act(() => {
      result.current.turnUp();
    });
    expect(result.current.direction).toEqual('up');
  });

  it('changes direction to right', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    act(() => {
      result.current.turnRight();
    });
    expect(result.current.direction).toEqual('right');
  });

  it('changes direction to down', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    act(() => {
      result.current.turnDown();
    });
    expect(result.current.direction).toEqual('down');
  });

  it('pauses the game', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    act(() => {
      result.current.pauseGame();
    });
    expect(result.current.direction).toEqual('pause');
  });

  it('toggles pause game', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: TestStoreProvider,
    });
    act(() => {
      result.current.toggleStatus();
    });
    expect(result.current.direction).toEqual('right');
    act(() => {
      result.current.toggleStatus();
    });
    expect(result.current.direction).toEqual('pause');
  });
});
