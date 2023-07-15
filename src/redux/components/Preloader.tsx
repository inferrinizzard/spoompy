'use client';

import React, { useRef } from 'react';

import store, { AppState } from '../store';
import { setEntities } from '../slices/playlistSlice';

export interface PreloaderProps {
  playlist: AppState['playlist'];
}

const Preloader: React.FC<PreloaderProps> = ({ playlist }) => {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setEntities(playlist));
    loaded.current = true;
  }

  return null;
};

export default Preloader;
