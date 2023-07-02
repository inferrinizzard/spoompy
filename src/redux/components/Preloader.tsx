'use client';

import React, { useRef } from 'react';

import store, { AppState } from '../store';
import { setPlaylists, setTracks } from '../slices/playlistSlice';

export interface PreloaderProps {
  playlist: AppState['playlist'];
}

const Preloader: React.FC<PreloaderProps> = ({ playlist: { tracks, playlists } }) => {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setTracks(tracks));
    store.dispatch(setPlaylists(playlists));
    loaded.current = true;
  }

  return null;
};

export default Preloader;
