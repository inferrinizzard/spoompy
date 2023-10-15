/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type DateRange, type TimeStep } from '@/types/common';

import { type AppState } from '../store';
import { replaceState } from '../actions/client/replaceState';

export interface AnalysisState {
  dateRange: DateRange;
  timeStep: TimeStep;
}

const initialState: AnalysisState = {
  dateRange: {},
  timeStep: 'month',
};

export const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setStartDate: (state, action: PayloadAction<string>) => {
      state.dateRange.start = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.dateRange.end = action.payload;
    },
    clearDates: (state) => {
      state.dateRange = {};
    },
    setTimeStep: (state, action: PayloadAction<TimeStep>) => {
      state.timeStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(replaceState, (_, action) => {
      return action.payload.analysis;
    });
  },
});

export const { setStartDate, setEndDate, clearDates, setTimeStep } =
  analysisSlice.actions;

export const selectStartDate = (state: AppState) =>
  state.analysis.dateRange.start;
export const selectEndDate = (state: AppState) => state.analysis.dateRange.end;
export const selectTimeStep = (state: AppState) => state.analysis.timeStep;

export default analysisSlice.reducer;
