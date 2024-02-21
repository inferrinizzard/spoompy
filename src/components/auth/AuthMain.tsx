'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectAuthStatus } from '@/redux/slices/userSlice';
import { useAppSelector } from '@/redux/client';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import { getBrowserCookieString } from '@/actions/cookies/clientCookies';
import { setServerCookie } from '@/actions/cookies/serverCookies';
import useLogin from '@/hooks/login';
import { syncCookies } from '@/actions/cookies/sync';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

export interface AuthMainProps {}

export const AuthMain: React.FC<AuthMainProps> = () => {
  const login = useLogin();
  const isAuthed = useAppSelector(selectAuthStatus);

  useEffect(() => {
    syncCookies();
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isAuthed && <LoginButton />}
      {isAuthed && <LogoutButton />}
    </>
  );
};

export default AuthMain;
