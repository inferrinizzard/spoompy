import { cookies } from 'next/headers';

import { type AuthCredentials, type AuthSession } from '@/types/api';

import { getSpotify } from './init';

export const tryGetAuthSession = () => {
  const authSession = cookies().get('AUTH_SESSION')?.value;

  if (authSession) {
    return authSession as unknown as AuthSession;
  }
  return null;
};

export const generateSession = async () => {
  const spotify = getSpotify();

  const cookieStore = cookies();
  const authCredentials = cookieStore.get('AUTH_CODE')!.value as unknown as AuthCredentials;

  const authSession = await spotify
    .authorizationCodeGrant(authCredentials.code)
    .then(({ body }) => {
      const accessToken = body.access_token;
      const refreshToken = body.refresh_token;
      const tokenType = body.token_type;
      const expiresIn = body.expires_in;
      const scope = body.scope;

      spotify.setAccessToken(accessToken);
      spotify.setRefreshToken(refreshToken);

      return {
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        scope,
      };
    })
    .catch(error => new Error(error));

  if (authSession instanceof Error) {
    throw authSession;
  }

  return authSession as AuthSession;
};
