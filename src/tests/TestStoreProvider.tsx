import React, { PropsWithChildren } from 'react';
import { GameStore } from '../model';
import { initialState, StoreContextProvider } from '../store/storeInstance';

type Props = {
  stateOverride?: Partial<GameStore>;
};
const TestStoreProvider = (props: PropsWithChildren<Props>) => {
  const { stateOverride, children } = props;
  const state = { ...initialState, ...stateOverride };
  return (
    <StoreContextProvider initialState={state}>{children}</StoreContextProvider>
  );
};

export default TestStoreProvider;
