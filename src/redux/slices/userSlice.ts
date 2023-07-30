import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type UserDetails } from '@/types/api';

import type { AppState } from '../store';

export interface UserState {
  isAuthed: boolean;
  userDetails?: UserDetails;
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
    setUserDetails: (state, action: PayloadAction<UserDetails>) => {
      state.userDetails = action.payload;
    },
  },
});

export const { setAuthStatus, setUserDetails } = userSlice.actions;

export const selectAuthStatus = (state: AppState) => state.user.isAuthed;
export const selectUserDetails = (state: AppState) => state.user.userDetails;

export default userSlice.reducer;
