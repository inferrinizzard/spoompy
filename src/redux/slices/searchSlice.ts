import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface SearchState {
  query: string;
}

const initialState: SearchState = {
  query: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export const { setSearch } = searchSlice.actions;

export const selectQuery = (state: AppState) => state.search.query;

export default searchSlice.reducer;
