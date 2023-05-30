import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';
import { PlaylistTrack } from '@/types/common';

export interface PlaylistState {
  tracks: PlaylistTrack[];
}

const initialState: PlaylistState = {
  tracks: [],
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<PlaylistTrack[]>) => {
      state.tracks = action.payload;
    },
  },
});

export const { setTracks } = playlistSlice.actions;

export const selectRawPlaylists = (state: AppState) => state.playlist.tracks;
export const selectPlaylists = (state: AppState) => state.playlist.tracks;

export default playlistSlice.reducer;
