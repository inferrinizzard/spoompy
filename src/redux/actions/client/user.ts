'use client';

import { getClientSpotify } from '@/spotify';
import { useAppDispatch, useAppSelector } from '@/redux/client';

import {
  selectAuthStatus,
  selectUserDetails,
  setUserDetails,
  setUserPlaylists,
} from '../../slices/userSlice';

export const useGetUserDetails = () => {
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectAuthStatus);

  if (isAuthed) {
    return async (): Promise<ReturnType<typeof dispatch>> =>
      await getClientSpotify()
        .getUserDetails()
        .then((user) => dispatch(setUserDetails(user)));
  }
};

export const useGetUserPlaylists = () => {
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectAuthStatus);
  const userDetails = useAppSelector(selectUserDetails);

  if (isAuthed && userDetails) {
    return async (): Promise<ReturnType<typeof dispatch>> =>
      await getClientSpotify()
        .getUserPlaylists(userDetails.id)
        .then((userPlaylists) => dispatch(setUserPlaylists(userPlaylists)));
  }
};
