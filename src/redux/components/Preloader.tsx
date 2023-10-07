'use client';

import React, { useRef } from 'react';

import store, { AppState } from '../store';
import { replaceState } from '../actions';

export interface PreloaderProps {
  readonly state: AppState;
}

const Preloader: React.FC<PreloaderProps> = ({ state }) => {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(replaceState(state));
    loaded.current = true;
  }

  return null;
};

export default Preloader;
