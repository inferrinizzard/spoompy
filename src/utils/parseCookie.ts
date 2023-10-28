// import { unescape } from 'querystring';

export const parseRawCookieString = <Return>(cookie: string): Return => {
  const decoded = decodeURIComponent(unescape(cookie));
  const cookieValue = decoded.split('=')[1];
  return JSON.parse(cookieValue);
};
