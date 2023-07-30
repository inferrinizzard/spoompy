import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import store from '@/redux/store';
import { setAuthStatus } from '@/redux/slices/userSlice';
import { generateSession } from '@/spotify/auth';

export async function GET(request: Request) {
  const urlParams = request.url.replace(/^.*[/]api[/]login?/, '');
  const queryParams = new URLSearchParams(urlParams);

  const authCode = queryParams.get('code')!;
  const state = queryParams.get('state');

  const cookieStore = cookies();
  // @ts-expect-error
  cookieStore.set('AUTH_CODE', { code: authCode, state });

  const authSession = await generateSession();
  // @ts-expect-error
  cookieStore.set('AUTH_SESSION', authSession);

  store.dispatch(setAuthStatus(true));
  redirect('http://localhost:3000');
}
