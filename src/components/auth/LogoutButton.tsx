'use client';

import { useRouter } from 'next/navigation';

import { clientSpotifyLogout } from '@/spotify/client';
import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import { logOut } from '@/redux/actions/server/user';
import { deleteBrowserCookie } from '@/actions/cookies/clientCookies';
import { deleteServerCookie } from '@/actions/cookies/serverCookies';
import { useAppDispatch } from '@/redux/client';
import {
  setAuthStatus,
  setUserDetails,
  setUserPlaylists,
} from '@/redux/slices/userSlice';

export interface LogoutButtonProps {}

export const LogoutButton: React.FC<LogoutButtonProps> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        clientSpotifyLogout();
        dispatch(setAuthStatus(false));
        dispatch(setUserDetails(undefined));
        dispatch(setUserPlaylists([]));
        logOut();
        deleteBrowserCookie(SPOTIFY_AUTH_COOKIE);
        deleteServerCookie(SPOTIFY_AUTH_COOKIE);

        router.replace('/');
      }}
      type="button">
      <h1
      // fontSize={24}
      >
        {'Log Out'}
      </h1>
    </button>
  );
};

export default LogoutButton;
