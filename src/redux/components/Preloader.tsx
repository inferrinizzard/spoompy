'use client';

import React, { useRef } from 'react';

import store, { AppState } from '../store';
import { setPlaylists, setTracks } from '../slices/playlistSlice';

export interface PreloaderProps {
  playlist: AppState['playlist'];
}

const Preloader: React.FC<PreloaderProps> = ({
  playlist: { tracks, playlists, lastFetchDate },
}) => {
  const loaded = useRef(false);
  if (!loaded.current) {
    const isDataStale = lastFetchDate?.add(7, 'days').isBefore(new Date());

    if (!store.getState().playlist.tracks.length || isDataStale) {
      store.dispatch(setTracks(tracks));
    }
    if (!store.getState().playlist.playlists.length || isDataStale) {
      store.dispatch(setPlaylists(playlists));
    }
    loaded.current = true;
  }

  return null;
};

export default Preloader;
