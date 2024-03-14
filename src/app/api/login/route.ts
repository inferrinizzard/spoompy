import { NextResponse } from 'next/server';
import { type AccessToken } from '@spotify/web-api-ts-sdk';

import { HOME_URL, SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import store from '@/redux/store';
import { setAuthStatus } from '@/redux/slices/userSlice';
import { setServerCookie } from '@/actions/cookies/serverCookies';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as AccessToken;

  const res = NextResponse.redirect(HOME_URL);

  if (!body) {
    return res;
  }

  console.info('[API] Received token, storing to cookie');

  const cookie = JSON.stringify(body);

  res.cookies.set(SPOTIFY_AUTH_COOKIE, cookie, {
    maxAge: body.expires_in,
    httpOnly: true,
  });
  setServerCookie(SPOTIFY_AUTH_COOKIE, cookie);

  store.dispatch(setAuthStatus(true));

  return res;
}
