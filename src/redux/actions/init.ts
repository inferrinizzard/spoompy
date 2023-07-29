import { getPlaylistTracks, getPlaylists } from '@/api';
import { getSpotify } from '@/spotify';
import { type NormalizedPlaylists } from '@/types/schema';
import { normalizePlaylists } from '@/utils/normalizr';

import store from '../store';
import { setEntities } from '../slices/playlistSlice';
import { setUserDetails } from '../slices/userSlice';

export const initPlaylists = async () => {
  if (!Object.keys(store.getState().playlist.playlists).length) {
    if (process.env.mock) {
      console.info('MOCK enabled, reading local json');
      const rawPlaylists = await getPlaylists();
      const playlists = rawPlaylists.map(({ tracks, ...rest }) => {
        const playlistTracks = getPlaylistTracks(rest.id);
        return { ...rest, tracks: playlistTracks };
      });

      const normalizedPlaylists = normalizePlaylists(playlists) as unknown as NormalizedPlaylists<
        typeof playlists
      >;

      store.dispatch(setEntities(normalizedPlaylists.entities));
    } else {
      console.info('MOCK disabled, pulling live data');
      const spotify = getSpotify();

      const userDetails = await spotify.getUserDetails();
      store.dispatch(setUserDetails(userDetails));
    }
  }
};
