import { SPOTIFY_AUTH_COOKIE } from '@/spotify';

import { getBrowserCookieString, setBrowserCookie } from './clientCookies';
import { getServerCookieString, setServerCookie } from './serverCookies';

export const syncCookies = (): void => {
  const serverCookie = getServerCookieString(SPOTIFY_AUTH_COOKIE);
  const browserCookie = getBrowserCookieString(SPOTIFY_AUTH_COOKIE);

  // sync browser cookie to server
  if (browserCookie) {
    setServerCookie(SPOTIFY_AUTH_COOKIE, browserCookie);
  }

  // sync server cookie to browser
  if (serverCookie && !browserCookie) {
    setBrowserCookie(SPOTIFY_AUTH_COOKIE, serverCookie);
  }
};
