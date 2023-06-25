import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DateRange } from '@/types/common';

import type { AppState } from '../store';

type TimeStep = 'year' | 'month' | 'day';

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
    clearDates: state => {
      state.dateRange = {};
    },
    setTimeStep: (state, action: PayloadAction<TimeStep>) => {
      state.timeStep = action.payload;
    },
  },
});

export const { setStartDate, setEndDate, clearDates, setTimeStep } = analysisSlice.actions;

export const selectStartDate = (state: AppState) => state.analysis.dateRange.start;
export const selectEndDate = (state: AppState) => state.analysis.dateRange.end;
export const selectTimeStep = (state: AppState) => state.analysis.timeStep;

export default analysisSlice.reducer;
