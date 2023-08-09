import { NextResponse } from 'next/server';

import store from '@/redux/store';
import { setAuthStatus } from '@/redux/slices/userSlice';
import { generateSession } from '@/spotify/auth';

export async function GET(request: Request) {
  const urlParams = request.url.replace(/^.*[/]api[/]login/, '');
  const queryParams = new URLSearchParams(urlParams);

  const authCode = queryParams.get('code');
  const state = queryParams.get('state');
  if (!authCode || !state) {
    throw new Error('Invalid authCode or state');
  }

  const authSession = await generateSession({ code: authCode, state });

  store.dispatch(setAuthStatus(true));

  const res = NextResponse.redirect('http://localhost:3000');
  res.cookies.set('AUTH_SESSION', JSON.stringify(authSession), {
    maxAge: authSession.expiresIn,
  });

  return res;
}
