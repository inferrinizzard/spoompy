/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type PlaylistEntities } from '@/types/schema';
import { mergeEntities } from '@/utils/mergeEntities';

import { type AppState } from '../store';
import { preloadState } from '../actions/client/preloadState';

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
    updateEntities: (state, action: PayloadAction<PlaylistEntities>) => {
      mergeEntities(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(preloadState, (_, action) => {
      return action.payload.playlist;
    });
  },
});

export const { updateEntities } = playlistSlice.actions;

export const selectTracks = (state: AppState) => state.playlist.tracks;
export const selectPlaylists = (state: AppState) => state.playlist.playlists;
export const selectArtists = (state: AppState) => state.playlist.artists;
export const selectAlbums = (state: AppState) => state.playlist.albums;

export default playlistSlice.reducer;
