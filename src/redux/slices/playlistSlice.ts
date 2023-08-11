/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type PlaylistEntities } from '@/types/schema';

import { type AppState } from '../store';

export type PlaylistState = PlaylistEntities;

const initialState: PlaylistState = {
  albums: {},
  artists: {},
  tracks: {},
  playlists: {},
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setEntities: (state, action: PayloadAction<PlaylistEntities>) => {
      return action.payload;
    },
  },
});

export const { setEntities } = playlistSlice.actions;

export const selectTracks = (state: AppState) => state.playlist.tracks;
export const selectPlaylists = (state: AppState) => state.playlist.playlists;
export const selectArtists = (state: AppState) => state.playlist.artists;
export const selectAlbums = (state: AppState) => state.playlist.albums;

export default playlistSlice.reducer;
