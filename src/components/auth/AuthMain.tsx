'use client';

import { useRef } from 'react';
import { useSelector } from 'react-redux';

import { sendBrowserCookie } from '@/redux/actions/server/init';
import { selectAuthStatus } from '@/redux/slices/userSlice';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import { parseRawCookieString } from '@/utils/parseCookie';
import useLogin from '@/hooks/login';

import LoginButton from './LoginButton';

export interface AuthMainProps {}

export const AuthMain: React.FC<AuthMainProps> = () => {
  const login = useLogin();
  const isAuthed = useSelector(selectAuthStatus);

  const sentBrowserCookie = useRef(false);

  if (!sentBrowserCookie.current) {
    const allCookies = document.cookie;
    const spotifyAuthTokenCookie = allCookies
      .split(';')
      .find((cookie) => cookie.includes(SPOTIFY_AUTH_COOKIE))
      ?.trim();

    if (spotifyAuthTokenCookie) {
      const authToken = parseRawCookieString(spotifyAuthTokenCookie);
      sendBrowserCookie(SPOTIFY_AUTH_COOKIE, JSON.stringify(authToken));

      login();
    }
    sentBrowserCookie.current = true;
  }

  return <>{!isAuthed && <LoginButton />}</>;
};

export default AuthMain;
