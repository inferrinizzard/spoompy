import { getPlaylists } from '@/api';

import store from '../store';
import { setTracks } from '../slices/playlistSlice';

export const initTracks = () => {
  if (!store.getState().playlist.tracks.length) {
    const playlists = getPlaylists();
    console.log('=============== loaded tracks');
    store.dispatch(setTracks(playlists));
  }
  return undefined;
};
