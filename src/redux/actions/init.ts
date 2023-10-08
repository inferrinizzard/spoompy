'use server';

import { tryGetAuthSession } from '@/spotify/util';

import store from '../store';
import { setAuthStatus } from '../slices/userSlice';

export const readAuthSession = (): void => {
  const authSession = tryGetAuthSession();

  if (authSession) {
    store.dispatch(setAuthStatus(true));
  }
};
