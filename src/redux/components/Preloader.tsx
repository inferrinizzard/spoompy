'use client';

import React, { useRef } from 'react';

import store from '../store';
import { type PlaylistState, setEntities } from '../slices/playlistSlice';

export interface PreloaderProps {
  playlist: PlaylistState;
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
