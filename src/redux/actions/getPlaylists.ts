import { getClientSpotify } from '@/spotify/client';
import { normalizePlaylists } from '@/utils/normalizr/normalize';
import { type PlaylistRef } from '@/types/api';

import store from '../store';
import { updateEntities } from '../slices/playlistSlice';

export const getPlaylists = async (playlists: PlaylistRef[]): Promise<void> => {
  playlists
    .map(getClientSpotify().getPlaylistWithTracks) // check here which playlists already exist in store
    .map(
      async (promise) =>
        await promise.then((playlist) => {
          const normalizedPlaylist = normalizePlaylists([playlist]);
          store.dispatch(updateEntities(normalizedPlaylist.entities));
        }),
    );
};