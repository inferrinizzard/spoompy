import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type PlaylistTrackWithName } from '@/types/common';

import type { AppState } from '../store';
import { Dayjs } from 'dayjs';

export interface PlaylistState {
  tracks: PlaylistTrackWithName[];
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  lastFetchDate: Dayjs | null;
}

const initialState: PlaylistState = {
  tracks: [],
  playlists: [],
  lastFetchDate: null,
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<PlaylistTrackWithName[]>) => {
      state.tracks = action.payload;
    },
    setPlaylists: (state, action: PayloadAction<SpotifyApi.PlaylistObjectSimplified[]>) => {
      state.playlists = action.payload;
      state.lastFetchDate = new Dayjs();
    },
  },
});

export const { setTracks, setPlaylists } = playlistSlice.actions;

export const selectRawPlaylists = (state: AppState) => state.playlist.tracks;
export const selectTracks = (state: AppState) => state.playlist.tracks;
export const selectPlaylists = (state: AppState) => state.playlist.playlists;

export default playlistSlice.reducer;
