'use server';

import { cookies } from 'next/headers';

export const getServerCookie = <Return>(key: string): Return | null => {
  const cookie = cookies().get(key)?.value;
  if (cookie) {
    return JSON.parse(cookie);
  }

  return null;
};

export const setServerCookie = (key: string, val: string): void => {
  cookies().set(key, val);
};
