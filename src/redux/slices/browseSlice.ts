import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface BrowseState {
  search: string;
  filters: {
    playlist?: string;
  };
  dateRange: {
    start?: string;
    end?: string;
  };
}

const initialState: BrowseState = {
  search: '',
  filters: {},
  dateRange: {},
};

export const browseSlice = createSlice({
  name: 'browse',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setPlaylistFilter: (state, action: PayloadAction<string>) => {
      state.filters.playlist = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.dateRange.start = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.dateRange.end = action.payload;
    },
    clearDates: state => {
      state.dateRange = {};
    },
  },
});

export const { setSearch, setPlaylistFilter, setStartDate, setEndDate, clearDates } =
  browseSlice.actions;

export const selectSearch = (state: AppState) => state.browse.search;
export const selectFilters = (state: AppState) => state.browse.filters;
export const selectPlaylistFilter = (state: AppState) => state.browse.filters.playlist;
export const selectStartDate = (state: AppState) => state.browse.dateRange.start;
export const selectEndDate = (state: AppState) => state.browse.dateRange.end;

export default browseSlice.reducer;
