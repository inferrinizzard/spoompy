import { type AccessToken } from '@spotify/web-api-ts-sdk';

import { SPOTIFY_AUTH_COOKIE } from '@/spotify';
import { setAuthStatus } from '@/redux/slices/userSlice';
import store from '@/redux/store';

import {
  deleteBrowserCookie,
  getBrowserCookie,
  setBrowserCookie,
} from './clientCookies';
import {
  deleteServerCookie,
  getServerCookie,
  setServerCookie,
} from './serverCookies';

export const syncCookies = async (): Promise<void> => {
  const serverCookie = await getServerCookie<AccessToken>(SPOTIFY_AUTH_COOKIE);
  const browserCookie = getBrowserCookie<AccessToken>(SPOTIFY_AUTH_COOKIE);

  if (!serverCookie?.access_token) {
    await deleteServerCookie(SPOTIFY_AUTH_COOKIE);
  }

  if (!browserCookie?.access_token) {
    deleteBrowserCookie(SPOTIFY_AUTH_COOKIE);
  }

  // sync browser cookie to server
  if (browserCookie?.access_token) {
    await setServerCookie(SPOTIFY_AUTH_COOKIE, browserCookie);
    store.dispatch(setAuthStatus(true));
  }

  // sync server cookie to browser
  if (serverCookie?.access_token && !browserCookie?.access_token) {
    setBrowserCookie(SPOTIFY_AUTH_COOKIE, serverCookie);
  }
};
