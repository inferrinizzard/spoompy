'use server';

import { getSpotify } from '@/spotify';

import store from '../store';
import { setUserDetails, setUserPlaylists } from '../slices/userSlice';

export const getUserDetails = async (): Promise<void> => {
  if (store.getState().user.isAuthed) {
    await getSpotify()
      .getUserDetails()
      .then((user) => store.dispatch(setUserDetails(user)));
  }
};

export const getUserPlaylists = async (): Promise<void> => {
  const user = store.getState().user;
  if (user.isAuthed && user.userDetails) {
    await getSpotify()
      .getUserPlaylists(user.userDetails.id)
      .then((userPlaylists) => store.dispatch(setUserPlaylists(userPlaylists)));
  }
};
