import { cookies } from 'next/headers';
import SpotifyWebApiNode from 'spotify-web-api-node';

import { type AuthSession, type UserDetails } from '@/types/api';

import { tryGetAuthSession } from './util';
import { handleRateLimitedError, throwError } from './handlers';

let spotify: SpotifyInstance;

export class SpotifyInstance {
  public api: SpotifyWebApiNode;

  public refreshTimer?: ReturnType<typeof setTimeout>;

  public constructor() {
    let spotifyApiParams: ConstructorParameters<typeof SpotifyWebApiNode>[0] = {
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      redirectUri: 'http://localhost:3000/api/login',
      // accessToken: undefined,
      // refreshToken: undefined,
    };

    const authSession = tryGetAuthSession();
    if (authSession) {
      if (authSession.expiresAt > new Date().getTime()) {
        spotifyApiParams.accessToken = authSession.accessToken;
        spotifyApiParams.refreshToken = authSession.refreshToken;

        this.refreshTimer = setTimeout(async () => {
          await this.refreshToken();
        }, Math.max(0, authSession.expiresIn - 100) * 1000);
      }
    }

    this.api = new SpotifyWebApiNode(spotifyApiParams);
  }

  public refreshToken = async (): Promise<void> =>
    await this.api.refreshAccessToken().then(({ body }) => {
      this.api.setAccessToken(body.access_token);
      if (body.refresh_token) {
        this.api.setRefreshToken(body.refresh_token);
      }

      const authSession = tryGetAuthSession();
      if (!authSession) {
        throw new Error('Invalid authSession on refreshToken!');
      }

      const newAuthSession: AuthSession = {
        ...authSession,
        accessToken: body.access_token,
        refreshToken: body.refresh_token ?? authSession.refreshToken,
        expiresIn: body.expires_in,
        expiresAt: new Date(
          new Date().getTime() + body.expires_in * 1000,
        ).getTime(),
      };

      cookies().set('AUTH_SESSION', JSON.stringify(newAuthSession));

      this.refreshTimer = setTimeout(
        async () => await this.refreshToken(),
        Math.max(0, body.expires_in - 100) * 1000,
      );
    });

  public getUserDetails = async (): Promise<UserDetails> =>
    await this.api
      .getMe()
      .then(handleRateLimitedError)
      .then(({ body }) => ({
        name: body.display_name ?? '',
        id: body.id,
        image: body.images?.at(0)?.url ?? '', // TODO: add default profile image url
      }))
      .catch(throwError);
}

export const getSpotify = (): SpotifyInstance => {
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
