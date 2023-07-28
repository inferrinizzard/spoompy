import SpotifyWebApiNode from 'spotify-web-api-node';
import { redirect } from 'next/navigation';

import { tryGetAuthSession } from './auth';

let spotify: SpotifyWebApiNode;

export const getSpotify = () => {
  if (!spotify) {
    if (process.env.NODE_ENV === 'production') {
      spotify = createSpotifyInstance();
    } else {
      if (!global.spotify) {
        global.spotify = createSpotifyInstance();
      }
      spotify = global.spotify;
    }
  }
  return spotify;
};

export const createSpotifyInstance = () => {
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

  return new SpotifyWebApiNode(spotifyApiParams);
};

export const beginAuthSpotify = () => {
  const scopes = ['user-top-read'];
  const state = 'test';

  const redirectUrl = getSpotify().createAuthorizeURL(scopes, state);
  redirect(redirectUrl);
};
