import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../store';

export interface UserState {
  isAuthed: boolean;
}

const initialState: UserState = {
  isAuthed: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthed = action.payload;
    },
  },
});

export const { setAuthStatus } = userSlice.actions;

export const selectAuthStatus = (state: AppState) => state.user.isAuthed;

export default userSlice.reducer;
