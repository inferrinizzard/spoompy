'use server';

import { getSpotify } from '@/spotify';
import { normalizePlaylists } from '@/utils/normalizr/normalize';
import { type NormalizedPlaylists } from '@/types/schema';
import { type SpotifyPlaylist } from '@/types/api';

import store from '../store';
import { setEntities } from '../slices/playlistSlice';

export const getAllPlaylistTracks = async (): Promise<void> => {
  if (!store.getState().user.isAuthed) {
    return;
  }

  const playlists = store.getState().user.playlists.slice(0, 10); // TODO: temp

  const updateReduxStoreCallback = (playlist: SpotifyPlaylist): void => {
    const normalizedPlaylist = normalizePlaylists([
      playlist,
    ]) as unknown as NormalizedPlaylists;
    store.dispatch(setEntities(normalizedPlaylist.entities));
  };

  await getSpotify().getAllPlaylistTracks(playlists, updateReduxStoreCallback);

  // store
  //   .getState()
  //   .user.playlists.slice(0, 10) // TODO: temp
  //   .map(getSpotify().getPlaylistWithTracks) // check here which playlists already exist in store
  //   .map(
  //     async (promise) =>
  //       await promise.then((playlist) => {
  //         const normalizedPlaylist = normalizePlaylists([
  //           playlist,
  //         ]) as unknown as NormalizedPlaylists;
  //         store.dispatch(setEntities(normalizedPlaylist.entities));
  //       }),
  //   );
};
