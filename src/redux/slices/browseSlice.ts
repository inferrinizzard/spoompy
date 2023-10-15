/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type DateRange } from '@/types/common';

import { type AppState } from '../store';
import { replaceState } from '../actions/client/replaceState';

interface BrowseFilters {
  playlist?: string;
}

interface BrowseSort {
  asc: boolean;
  column: string;
}

interface BrowseSlice {
  index: number;
  size: number;
}

export interface BrowseState {
  dateRange: DateRange;
  filters: BrowseFilters;
  search: string;
  slice: BrowseSlice;
  sort?: BrowseSort;
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
    clearDates: (state) => {
      state.dateRange = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(replaceState, (_, action) => {
      return action.payload.browse;
    });
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
export const selectPlaylistFilter = (state: AppState) =>
  state.browse.filters.playlist;
export const selectSort = (state: AppState) => state.browse.sort;
export const selectSlice = (state: AppState) => state.browse.slice;
export const selectStartDate = (state: AppState) =>
  state.browse.dateRange.start;
export const selectEndDate = (state: AppState) => state.browse.dateRange.end;

export default browseSlice.reducer;
