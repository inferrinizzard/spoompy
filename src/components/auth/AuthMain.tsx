'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/redux/client';
import {
  selectAuthStatus,
  selectUserDetails,
  setAuthStatus,
} from '@/redux/slices/userSlice';
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
  const dispatch = useAppDispatch();

  const isAuthed = useSelector(selectAuthStatus);
  const userDetails = useSelector(selectUserDetails);

  const getUserDetails = useGetUserDetails();
  const getUserPlaylists = useGetUserPlaylists();

  useEffect(() => {
    // sync browser and server cookies
    // then set isAuthed and fetch userDetails if browser cookie was loaded with server
    // TODO: use suspense boundary
    const effect = async () => {
      await syncCookies();

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
    };
    effect();
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
