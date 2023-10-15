/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type User } from '@spotify/web-api-ts-sdk';

import { type AppState } from '../store';
import { replaceState } from '../actions/client/replaceState';

export interface UserState {
  isAuthed: boolean;
  playlists: string[];
  userDetails?: User;
}

const initialState: UserState = {
  isAuthed: false,
  playlists: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.isAuthed = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<User>) => {
      state.userDetails = action.payload;
    },
    setUserPlaylists: (state, action: PayloadAction<string[]>) => {
      state.playlists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(replaceState, (_, action) => {
      return action.payload.user;
    });
  },
});

export const { setAuthStatus, setUserDetails, setUserPlaylists } =
  userSlice.actions;

export const selectAuthStatus = (state: AppState) => state.user.isAuthed;
export const selectUserDetails = (state: AppState) => state.user.userDetails;
export const selectUserPlaylists = (state: AppState) => state.user.playlists;

export default userSlice.reducer;
