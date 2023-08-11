import { type AuthCredentials, type AuthSession } from '@/types/api';

import { getSpotify } from './main';

export const generateSession = async (
  authCredentials: AuthCredentials,
): Promise<AuthSession> => {
  const spotifyInstance = getSpotify();

  const authSession: AuthSession = await spotifyInstance.api
    .authorizationCodeGrant(authCredentials.code)
    .then(({ body }) => {
      const accessToken = body.access_token;
      const refreshToken = body.refresh_token;
      const tokenType = body.token_type;
      const expiresIn = body.expires_in;
      const expiresAt = new Date(
        new Date().getTime() + expiresIn * 1000,
      ).getTime();
      const scope = body.scope;

      spotifyInstance.api.setAccessToken(accessToken);
      spotifyInstance.api.setRefreshToken(refreshToken);

      spotifyInstance.refreshTimer = setTimeout(
        async () => await spotifyInstance.refreshToken(),
        Math.max(0, expiresIn - 100) * 1000,
      );

      return {
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        expiresAt,
        scope,
      };
    })
    .catch((error) => {
      throw new Error(error);
    });

  return authSession;
};

export const generateAuthUrl = (): string => {
  const scopes = [
    'playlist-read-collaborative',
    'playlist-read-private',
    'user-library-read',
    'user-read-recently-played',
    'user-top-read',
  ];
  const state = 'test';

  const redirectUrl = getSpotify().api.createAuthorizeURL(scopes, state);
  return redirectUrl;
};
