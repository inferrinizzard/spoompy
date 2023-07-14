import { getPlaylistTracks, getPlaylists, getTracks } from '@/api';

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
    const rawPlaylists = await getPlaylists();
    const playlists = rawPlaylists.map(({ tracks, ...rest }) => {
      const playlistTracks = getPlaylistTracks(rest.id);
      return { ...rest, tracks: playlistTracks };
    });

    store.dispatch(setPlaylists(playlists));
  }
};
