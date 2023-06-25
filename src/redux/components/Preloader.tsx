'use client';

import React, { useRef } from 'react';

import { type PlaylistTrackWithName } from '@/types/common';

import store from '../store';
import { setTracks } from '../slices/playlistSlice';

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
