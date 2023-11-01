// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_ID!;

export const SPOTIFY_SCOPES = [
  'playlist-read-collaborative',
  'playlist-read-private',
  'user-library-read',
  'user-read-recently-played',
  'user-top-read',
];

export const HOME_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.VERCEL_URL
    : 'http://localhost:3000';
export const SPOTIFY_POSTBACK_URL = `${HOME_URL}/api/login`;

export const SPOTIFY_AUTH_COOKIE = 'SPOTIFY_ACCESS_TOKEN';
