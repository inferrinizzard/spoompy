import { cookies } from 'next/headers';
import SpotifyWebApiNode from 'spotify-web-api-node';

import { type AuthSession, type AuthCredentials } from '@/types/api';
import { redirect } from 'next/navigation';

let spotify: SpotifyWebApiNode;

export const getSpotify = () => {
  if (!spotify) {
    if (process.env.NODE_ENV === 'production') {
      spotify = bootstrap();
    } else {
      if (!global.spotify) {
        global.spotify = bootstrap();
      }
      spotify = global.spotify;
    }
  }
  return spotify;
};

export const bootstrap = () => {
  spotify = new SpotifyWebApiNode({
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'http://localhost:3000/api/login',
  });

  const authSession = cookies().get('AUTH_SESSION')?.value as unknown as AuthSession;
  if (authSession) {
    spotify.setAccessToken(authSession.accessToken);
    spotify.setRefreshToken(authSession.refreshToken);
  } else {
    console.log('Session not found, starting login');
    const redirectUrl = initAuthCode();
    redirect(redirectUrl);
  }

  return spotify;
};

export const initAuthCode = () => {
  const scopes = ['user-top-read'];
  const state = 'test';

  return spotify.createAuthorizeURL(scopes, state);
};

export const generateSession = async () => {
  const cookieStore = cookies();
  const authCredentials = cookieStore.get('AUTH_CODE')!.value as unknown as AuthCredentials;

  // console.log(authCredentials);

  const authSession = await getSpotify()
    .authorizationCodeGrant(authCredentials.code)
    .then(({ body }) => {
      const accessToken = body.access_token;
      const refreshToken = body.refresh_token;
      const tokenType = body.token_type;
      const expiresIn = body.expires_in;
      const scope = body.scope;

      spotify.setAccessToken(accessToken);
      spotify.setRefreshToken(refreshToken);

      return {
        accessToken,
        refreshToken,
        tokenType,
        expiresIn,
        scope,
      };
    })
    .catch(error => new Error(error));

  if (authSession instanceof Error) {
    throw authSession;
  }

  return authSession as AuthSession;
};
