'use server';

import { getSpotify } from '@/spotify';
import { type SpotifyPlaylist } from '@/types/api';
import { normalizePlaylists } from '@/utils/normalizr';
import { type NormalizedPlaylists } from '@/types/schema';

import store from '../store';
import { setEntities } from '../slices/playlistSlice';

export const getAllPlaylistTracks = async (): Promise<void> => {
  if (store.getState().user.isAuthed) {
    const playlistPromises = store
      .getState()
      .user.playlists.slice(0, 10) // TODO: temp
      .map(
        async (playlist) => await getSpotify().getPlaylistWithTracks(playlist),
      );

    const playlistsRes = await Promise.allSettled(playlistPromises);

    let playlists: SpotifyPlaylist[] = [];
    for (let playlist of playlistsRes) {
      if (playlist.status === 'rejected') {
        console.info('Failed!', playlist.reason); // TODO: retry
      } else {
        playlists.push(playlist.value);
      }
    }

    const normalizedPlaylists = normalizePlaylists(
      playlists,
    ) as unknown as NormalizedPlaylists<typeof playlists>;

    store.dispatch(setEntities(normalizedPlaylists.entities));
  }
};
