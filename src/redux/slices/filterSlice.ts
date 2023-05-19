import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface FilterState {
  playlist: string;
}

const initialState: FilterState = {
  playlist: '',
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setPlaylistFilter: (state, action: PayloadAction<string>) => {
      state.playlist = action.payload;
    },
  },
});

export const { setPlaylistFilter } = filterSlice.actions;

export const selectPlaylistFilter = (state: AppState) => state.filter.playlist;

export default filterSlice.reducer;
