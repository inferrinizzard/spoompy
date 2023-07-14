import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type SpotifyPlaylist } from '@/types/api';
import { type PlaylistTrackWithName } from '@/types/common';

import type { AppState } from '../store';

export interface PlaylistState {
  tracks: PlaylistTrackWithName[];
  playlists: SpotifyPlaylist[];
}

const initialState: PlaylistState = {
  tracks: [],
  playlists: [],
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<PlaylistTrackWithName[]>) => {
      state.tracks = action.payload;
    },
    setPlaylists: (state, action: PayloadAction<SpotifyPlaylist[]>) => {
      state.playlists = action.payload;
    },
  },
});

export const { setTracks, setPlaylists } = playlistSlice.actions;

export const selectRawPlaylists = (state: AppState) => state.playlist.tracks;
export const selectTracks = (state: AppState) => state.playlist.tracks;
export const selectPlaylists = (state: AppState) => state.playlist.playlists;

export default playlistSlice.reducer;
