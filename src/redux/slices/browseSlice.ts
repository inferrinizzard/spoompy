import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DateRange } from '@/types/common';

import type { AppState } from '../store';

interface BrowseFilters {
  playlist?: string;
}

interface BrowseSort {
  column: string;
  asc: boolean;
}

interface BrowseSlice {
  index: number;
  size: number;
}

export interface BrowseState {
  search: string;
  filters: BrowseFilters;
  sort?: BrowseSort;
  dateRange: DateRange;
  slice: BrowseSlice;
}

const initialState: BrowseState = {
  search: '',
  filters: {},
  dateRange: {},
  slice: { index: 0, size: 50 },
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
    setSort: (state, action: PayloadAction<BrowseSort | undefined>) => {
      state.sort = action.payload;
    },
    setSliceIndex: (state, action: PayloadAction<number>) => {
      state.slice.index = action.payload;
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

export const {
  setSearch,
  setPlaylistFilter,
  setSort,
  setSliceIndex,
  setStartDate,
  setEndDate,
  clearDates,
} = browseSlice.actions;

export const selectSearch = (state: AppState) => state.browse.search;
export const selectFilters = (state: AppState) => state.browse.filters;
export const selectPlaylistFilter = (state: AppState) => state.browse.filters.playlist;
export const selectSort = (state: AppState) => state.browse.sort;
export const selectSlice = (state: AppState) => state.browse.slice;
export const selectStartDate = (state: AppState) => state.browse.dateRange.start;
export const selectEndDate = (state: AppState) => state.browse.dateRange.end;

export default browseSlice.reducer;
