'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/redux/client';
import {
  selectAuthStatus,
  selectUserDetails,
  setAuthStatus,
} from '@/redux/slices/userSlice';
import useLogin from '@/hooks/login';
import {
  useGetUserDetails,
  useGetUserPlaylists,
} from '@/redux/actions/client/user';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify';
import { syncCookies } from '@/actions/cookies/sync';
import { getBrowserCookieString } from '@/actions/cookies/clientCookies';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

export interface AuthMainProps {
  serverCookie: string | null;
}

export const AuthMain: React.FC<AuthMainProps> = ({ serverCookie }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const login = useLogin();
  const isAuthed = useSelector(selectAuthStatus);
  const userDetails = useSelector(selectUserDetails);

  const getUserDetails = useGetUserDetails();
  const getUserPlaylists = useGetUserPlaylists();

  const browserCookie = getBrowserCookieString(SPOTIFY_AUTH_COOKIE);

  console.log('render AuthMain', {
    serverCookie: !!serverCookie,
    browserCookie: !!browserCookie,
  });

  useEffect(() => {
    console.log('useEffect 1 AuthMain');
    syncCookies();

    if (!getBrowserCookieString(SPOTIFY_AUTH_COOKIE)) {
      return;
    }

    if (!isAuthed) {
      dispatch(setAuthStatus(true));
    }

    if (userDetails) {
      return;
    }

    getUserDetails?.().then(getUserPlaylists);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverCookie, isAuthed]);

  return (
    <>
      {!isAuthed && <LoginButton />}
      {isAuthed && <LogoutButton />}
    </>
  );
};

export default AuthMain;
