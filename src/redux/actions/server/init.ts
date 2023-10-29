'use server';

import { tryGetAuthSession } from '@/spotify/utils/getSession';

import store from '../../store';
import { setAuthStatus } from '../../slices/userSlice';

export const readAuthSession = (): void => {
  const authSession = tryGetAuthSession();

  console.info(`[Init] Reading stored auth status: ${!!authSession}`);
  if (authSession) {
    store.dispatch(setAuthStatus(true));
  }
};
