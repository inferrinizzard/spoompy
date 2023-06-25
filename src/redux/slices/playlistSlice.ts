import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PlaylistTrackWithName } from '@/types/common';

import type { AppState } from '../store';

export interface PlaylistState {
  tracks: PlaylistTrackWithName[];
}

const initialState: PlaylistState = {
  tracks: [],
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<PlaylistTrackWithName[]>) => {
      state.tracks = action.payload;
    },
  },
});

export const { setTracks } = playlistSlice.actions;

export const selectRawPlaylists = (state: AppState) => state.playlist.tracks;
export const selectPlaylists = (state: AppState) => state.playlist.tracks;

export default playlistSlice.reducer;
