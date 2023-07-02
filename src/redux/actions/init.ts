import { getPlaylists, getTracks } from '@/api';

import store from '../store';
import { setPlaylists, setTracks } from '../slices/playlistSlice';

export const initTracks = () => {
  if (!store.getState().playlist.tracks.length) {
    const tracks = getTracks();
    store.dispatch(setTracks(tracks));
  }
};

export const initPlaylists = async () => {
  // TODO: check if authed
  if (!store.getState().playlist.playlists.length) {
    const playlists = await getPlaylists();
    store.dispatch(setPlaylists(playlists));
  }
};
