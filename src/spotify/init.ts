import SpotifyWebApiNode from 'spotify-web-api-node';

import { tryGetAuthSession } from './auth';

let spotify: SpotifyInstance;

export const getSpotify = () => {
  if (!spotify) {
    if (process.env.NODE_ENV === 'production') {
      spotify = new SpotifyInstance();
    } else {
      if (!global.spotify) {
        global.spotify = new SpotifyInstance();
      }
      spotify = global.spotify;
    }
  }
  return spotify;
};

export class SpotifyInstance {
  api: SpotifyWebApiNode;

  constructor() {
    let spotifyApiParams: any = {
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      redirectUri: 'http://localhost:3000/api/login',
      // accessToken: undefined,
      // refreshToken: undefined,
    };

    const authSession = tryGetAuthSession();
    if (authSession) {
      spotifyApiParams.accessToken = authSession.accessToken;
      spotifyApiParams.refreshToken = authSession.refreshToken;
    }

    this.api = new SpotifyWebApiNode(spotifyApiParams);
  }
}
