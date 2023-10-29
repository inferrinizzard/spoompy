'use client';

import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { sendBrowserCookie } from '@/redux/actions/server/init';
import { selectAuthStatus } from '@/redux/slices/userSlice';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import { getBrowserCookie } from '@/utils/cookies';
import useLogin from '@/hooks/login';

import LoginButton from './LoginButton';

export interface AuthMainProps {}

export const AuthMain: React.FC<AuthMainProps> = () => {
  const login = useLogin();
  const isAuthed = useSelector(selectAuthStatus);

  const sentBrowserCookie = useRef(false);

  if (!sentBrowserCookie.current) {
    const authTokenString = getBrowserCookieString(SPOTIFY_AUTH_COOKIE);

    if (authTokenString) {
      sendBrowserCookie(SPOTIFY_AUTH_COOKIE, authTokenString);

      login();
    }
    sentBrowserCookie.current = true;
  }

  return <>{!isAuthed && <LoginButton />}</>;
};

export default AuthMain;
