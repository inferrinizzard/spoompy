import BrowserCookies from 'js-cookie';

export const getBrowserCookie = <Return>(key: string): Return | null => {
  const cookie = BrowserCookies.get(key);

  if (cookie) {
    return JSON.parse(cookie);
  }

  return null;
};

export const getBrowserCookieString = (key: string): string | null => {
  const cookie = BrowserCookies.get(key);

  if (cookie) {
    return cookie;
  }

  return null;
};

export const setBrowserCookie = (key: string, val: unknown): boolean => {
  try {
    BrowserCookies.set(key, JSON.stringify(val));
    return true;
  } catch {
    return false;
  }
};
