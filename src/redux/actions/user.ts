import store from '../store';
import { getSpotify } from '@/spotify';

import { setUserDetails } from '../slices/userSlice';

export const getUserDetails = () => {
  if (store.getState().user.isAuthed) {
    return getSpotify()
      .getUserDetails()
      .then(userDetails => store.dispatch(setUserDetails(userDetails)));
  }
};
