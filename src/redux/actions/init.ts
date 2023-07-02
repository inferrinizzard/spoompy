import { getTracks } from '@/api';

import store from '../store';
import { setTracks } from '../slices/playlistSlice';

export const initTracks = () => {
  if (!store.getState().playlist.tracks.length) {
    const playlists = getTracks();
    store.dispatch(setTracks(playlists));
  }
};
