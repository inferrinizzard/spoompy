import { type AccessToken } from '@spotify/web-api-ts-sdk';
import { cookies } from 'next/headers';

import { SPOTIFY_AUTH_COOKIE } from './constants';

export const tryGetAuthSession = (): AccessToken | null => {
  const authSessionString = cookies().get(SPOTIFY_AUTH_COOKIE)?.value;

  if (authSessionString) {
    const authSession = JSON.parse(authSessionString) as AccessToken;
    if (authSession.expires > new Date().getTime()) {
      return authSession;
    }
  }

  return null;
};
