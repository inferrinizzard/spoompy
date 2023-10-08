import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import { type AuthSession } from '@/types/api';

import { SPOTIFY_AUTH_COOKIE } from './constants';

export const tryGetAuthSession = (): AuthSession | null => {
  let authSession;

  if (typeof window === 'undefined') {
    authSession = cookies().get(SPOTIFY_AUTH_COOKIE)?.value;
  } else {
    authSession = getCookie('AUTH_SESSION');
  }

  if (authSession) {
    return JSON.parse(authSession) as AuthSession;
  }

  return null;
};
