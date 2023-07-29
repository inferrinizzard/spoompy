import SpotifyWebApiNode from 'spotify-web-api-node';

import { type UserDetails } from '@/types/api';

import { tryGetAuthSession } from './auth';
import { handleRateLimitedError, throwError } from './handlers';

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

  getUserDetails = (): Promise<UserDetails> =>
    this.api
      .getMe()
      .then(handleRateLimitedError)
      .then(({ body }) => ({
        name: body.display_name ?? '',
        id: body.id,
        image: body.images?.at(0)?.url ?? '', // TODO: add default profile image url
      }))
      .catch(throwError);
}
