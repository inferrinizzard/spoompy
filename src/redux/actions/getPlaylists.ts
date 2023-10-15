import { getClientSpotify } from '@/spotify/client';
import { type NormalizedPlaylists } from '@/types/schema';
import { normalizePlaylists } from '@/utils/normalizr/normalize';

import { updateEntities } from '../slices/playlistSlice';
import store from '../store';

export const getPlaylists = async (playlists: string[]): Promise<void> => {
  // console.log(localStorage);

  playlists
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
