'use client';

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { selectAuthStatus } from '@/redux/slices/userSlice';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import { getBrowserCookieString } from '@/actions/cookies/clientCookies';
import { setServerCookie } from '@/actions/cookies/serverCookies';
import useLogin from '@/hooks/login';

import LoginButton from './LoginButton';

export interface AuthMainProps {}

export const AuthMain: React.FC<AuthMainProps> = () => {
  const login = useLogin();
  const isAuthed = useSelector(selectAuthStatus);

  useEffect(() => {
    const authTokenString = getBrowserCookieString(SPOTIFY_AUTH_COOKIE);

    if (authTokenString) {
      setServerCookie(SPOTIFY_AUTH_COOKIE, authTokenString);

      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{!isAuthed && <LoginButton />}</>;
};

export default AuthMain;
