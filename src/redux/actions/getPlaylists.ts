import { getClientSpotify } from '@/spotify/client';
import { normalizePlaylists } from '@/utils/normalizr/normalize';
import { type PlaylistRef } from '@/types/api';
import { type NormalizedPlaylists } from '@/types/schema';

import store from '../store';
import { updateEntities } from '../slices/playlistSlice';

export const getPlaylists = async (playlists: PlaylistRef[]): Promise<void> => {
  // console.log(localStorage);

  playlists
    .map((playlist) => playlist.id)
    .map(getClientSpotify().getPlaylistWithTracks) // check here which playlists already exist in store
    .map(
      async (promise) =>
        await promise.then((playlist) => {
          const normalizedPlaylist = normalizePlaylists([
            playlist,
          ]) as unknown as NormalizedPlaylists;
          store.dispatch(updateEntities(normalizedPlaylist.entities));
        }),
    );
};
