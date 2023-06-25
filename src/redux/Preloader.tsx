'use client';

import React, { useRef } from 'react';
import store from './store';
import { setTracks } from './slices/playlistSlice';
import { PlaylistTrackWithName } from '@/types/common';

export interface PreloaderProps {
  tracks: PlaylistTrackWithName[];
}

const Preloader: React.FC<PreloaderProps> = ({ tracks }) => {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setTracks(tracks));
    loaded.current = true;
  }

  return null;
};

export default Preloader;
