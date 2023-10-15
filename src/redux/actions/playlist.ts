'use server';

import { getSpotify } from '@/spotify';
import { normalizePlaylists } from '@/utils/normalizr/normalize';
import { type NormalizedPlaylists } from '@/types/schema';

import store from '../store';
import { updateEntities } from '../slices/playlistSlice';

export const getAllPlaylistTracks = async (): Promise<void> => {
  if (!store.getState().user.isAuthed) {
    return;
  }

  store
    .getState()
    .user.playlists.slice(0, 10) // TODO: temp
    .map(getSpotify().getPlaylistWithTracks) // check here which playlists already exist in store
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
