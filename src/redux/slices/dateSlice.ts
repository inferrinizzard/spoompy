import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface DateState {
  start?: string;
  end?: string;
}

const initialState: DateState = {};

export const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setStart: (state, action: PayloadAction<string>) => {
      state.start = action.payload;
    },
    setEnd: (state, action: PayloadAction<string>) => {
      state.end = action.payload;
    },
    clear: state => {
      state.start = undefined;
      state.end = undefined;
    },
  },
});

export const { setStart, setEnd, clear } = dateSlice.actions;

export const selectStart = (state: AppState) => state.date.start;
export const selectEnd = (state: AppState) => state.date.end;

export default dateSlice.reducer;
