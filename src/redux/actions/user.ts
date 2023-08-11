import { getSpotify } from '@/spotify';

import store from '../store';
import { setUserDetails, setUserPlaylists } from '../slices/userSlice';

export const getUserDetails = async (): Promise<void> => {
  if (store.getState().user.isAuthed) {
    await getSpotify()
      .getUserDetails()
      .then((userDetails) => store.dispatch(setUserDetails(userDetails)));
  }
};

export const getUserPlaylists = async (): Promise<void> => {
  if (store.getState().user.isAuthed) {
    await getSpotify()
      .getUserPlaylists()
      .then((userPlaylists) => store.dispatch(setUserPlaylists(userPlaylists)));
  }
};
