import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { generateSession } from '@/spotify';

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

  redirect('http://localhost:3000');
}
