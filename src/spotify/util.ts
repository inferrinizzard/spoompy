import { cookies } from 'next/headers';

import { type AuthSession } from '@/types/api';

import { SPOTIFY_AUTH_COOKIE } from './constants';

export const tryGetAuthSession = (): AuthSession | null => {
  const authSessionString = cookies().get(SPOTIFY_AUTH_COOKIE)?.value;

  if (authSessionString) {
    const authSession = JSON.parse(authSessionString) as AuthSession;
    if (authSession.expiresAt > new Date().getTime()) {
      return authSession;
    }

    // cookies().delete(SPOTIFY_AUTH_COOKIE);
  }

  return null;
};
