import { getSpotify } from '@/spotify';

import store from '../store';

export const getAllPlaylistTracks = async (): Promise<void> => {
  if (store.getState().user.isAuthed) {
    for (const playlist of store.getState().user.playlists) {
      const playlistRes = await getSpotify().getPlaylistTracks(playlist);

      console.log(playlist, playlistRes.length);
      // .then((userDetails) => store.dispatch(setUserDetails(userDetails)));

      // ddos incoming lmao
    }
  }
};
