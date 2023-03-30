import React, {
  useCallback,
  useContext,
  createContext,
  useRef,
  PropsWithChildren,
  useState,
  useEffect,
} from 'react';

function createCustomStore<Store>(initialStateFromCreate: Store) {
  const useStoreData = (
    initialState: Store
  ): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  } => {
    const state = useRef(initialState);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<Store>) => {
      state.current = { ...state.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const get = useCallback(() => state.current, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return { get, set, subscribe };
  };

  type UseStoreReturnType = ReturnType<typeof useStoreData>;
  const StoreContext = createContext<UseStoreReturnType | null>(null);

  type StoreContextProviderProps = {
    initialState?: Store;
  };
  const StoreContextProvider = (
    props: PropsWithChildren<StoreContextProviderProps>
  ) => {
    const { children, initialState = initialStateFromCreate } = props;
    const state = useStoreData(initialState);
    return (
      <StoreContext.Provider value={state}>{children}</StoreContext.Provider>
    );
  };

  function useCustomStore<PartialStore>(
    selector: (state: Store) => PartialStore
  ): [PartialStore, (value: Partial<Store>) => void] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found');
    }

    const [state, setState] = useState(selector(store.get()));

    useEffect(() => {
      const unsubscribe = store.subscribe(() =>
        setState(selector(store.get()))
      );
      return () => unsubscribe();
    }, [selector, store]);

    return [state, store.set];
  }

  return {
    useCustomStore,
    StoreContextProvider,
  };
}

export default createCustomStore;
