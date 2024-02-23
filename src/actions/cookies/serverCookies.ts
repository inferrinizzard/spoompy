'use server';

import { cookies } from 'next/headers';

export const getServerCookieString = async (
  key: string,
): Promise<string | null> => cookies().get(key)?.value ?? null;

export const getServerCookie = async <Return>(
  key: string,
): Promise<Return | null> => {
  const cookie = await getServerCookieString(key);
  if (cookie) {
    return JSON.parse(cookie);
  }

  return null;
};

export const setServerCookie = async (
  key: string,
  val: unknown,
): Promise<void> => {
  cookies().set(key, JSON.stringify(val));
};

export const deleteServerCookie = async (key: string): Promise<void> => {
  cookies().delete(key);
};
