'use client';

import { Provider } from 'react-redux';
import { useRef } from 'react';

import { type AppState, type AppStore, makeStore } from '../store';
import { preloadState } from '../actions';

export interface ReduxProviderProps {
  state: AppState;
}

export const ReduxProvider: React.FC<
  React.PropsWithChildren<ReduxProviderProps>
> = ({ children, state }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    storeRef.current.dispatch(preloadState(state));
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
