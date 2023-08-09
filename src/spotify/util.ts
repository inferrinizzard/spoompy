import { cookies } from 'next/headers';

import { type AuthSession } from '@/types/api';

export const tryGetAuthSession = (): AuthSession | null => {
  const authSession = cookies().get('AUTH_SESSION')?.value;

  if (authSession) {
    return JSON.parse(authSession) as AuthSession;
  }

  return null;
};
