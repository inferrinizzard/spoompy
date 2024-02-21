'use server';

import { cookies } from 'next/headers';

export const getServerCookieString = (key: string): string | null =>
  cookies().get(key)?.value ?? null;

export const getServerCookie = <Return>(key: string): Return | null => {
  const cookie = getServerCookieString(key);
  if (cookie) {
    return JSON.parse(cookie);
  }

  return null;
};

export const setServerCookie = (key: string, val: string): void => {
  cookies().set(key, val);
};

export const deleteServerCookie = (key: string): void => {
  cookies().delete(key);
};
