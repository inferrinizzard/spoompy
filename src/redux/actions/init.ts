import { getPlaylistTracks, getPlaylists } from '@/api';
import { type NormalizedPlaylists } from '@/types/schema';
import { normalizePlaylists } from '@/utils/normalizr';

import store from '../store';
import { setEntities } from '../slices/playlistSlice';

export const initPlaylists = async () => {
  // TODO: check if authed
  if (!store.getState().playlist.playlists.length) {
    const rawPlaylists = await getPlaylists();
    const playlists = rawPlaylists.map(({ tracks, ...rest }) => {
      const playlistTracks = getPlaylistTracks(rest.id);
      return { ...rest, tracks: playlistTracks };
    });

    const normalizedPlaylists = normalizePlaylists(playlists) as unknown as NormalizedPlaylists<
      typeof playlists
    >;

    store.dispatch(setEntities(normalizedPlaylists.entities));
  }
};
