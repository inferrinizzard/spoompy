import { NextResponse } from 'next/server';
import { type AccessToken } from '@spotify/web-api-ts-sdk';

import { SPOTIFY_AUTH_COOKIE } from '@/spotify/constants';
import store from '@/redux/store';
import { setAuthStatus } from '@/redux/slices/userSlice';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as AccessToken;

  const res = NextResponse.redirect('http://localhost:3000');

  if (!body) {
    return res;
  }

  console.log('Received token, storing to cookie');

  res.cookies.set(SPOTIFY_AUTH_COOKIE, JSON.stringify(body), {
    maxAge: body.expires_in,
  });

  store.dispatch(setAuthStatus(true));

  return res;
}
