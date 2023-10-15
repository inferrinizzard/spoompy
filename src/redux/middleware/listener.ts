import { createListenerMiddleware } from '@reduxjs/toolkit';

// import { getAllPlaylistTracks } from '../actions/playlist';
import { setUserPlaylists } from '../slices/userSlice';

export const listenerMiddleware = createListenerMiddleware();

// listenerMiddleware.startListening({
//   actionCreator: setUserPlaylists,
//   effect: async (action, listenerApi) => {
//     await listenerApi.dispatch(getAllPlaylistTracks);
//   },
// });
