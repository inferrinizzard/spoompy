'use client';

import React, { useRef } from 'react';

import store, { AppState } from '../store';
import { setEntities } from '../slices/playlistSlice';
import {
  setAuthStatus,
  setUserDetails,
  setUserPlaylists,
} from '../slices/userSlice';

export interface PreloaderProps {
  readonly state: AppState;
}

const Preloader: React.FC<PreloaderProps> = ({ state }) => {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setEntities(state.playlist));
    store.dispatch(setAuthStatus(state.user.isAuthed));
    state.user.userDetails &&
      store.dispatch(setUserDetails(state.user.userDetails));
    store.dispatch(setUserPlaylists(state.user.playlists));
    loaded.current = true;
  }

  return null;
};

export default Preloader;
