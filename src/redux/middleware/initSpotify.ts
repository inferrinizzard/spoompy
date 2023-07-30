import { createListenerMiddleware } from '@reduxjs/toolkit';

import { setAuthStatus } from '../slices/userSlice';

const initSpotifyMiddleware = createListenerMiddleware();

initSpotifyMiddleware.startListening({
  actionCreator: setAuthStatus,
  effect: async (action, listenerApi) => {
    console.log('dispatched from setAuthStatus');
  },
});

export default initSpotifyMiddleware;
