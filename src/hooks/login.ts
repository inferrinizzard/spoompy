import { useRouter } from 'next/navigation';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

import {
  REROUTE_HOME_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_POSTBACK_URL,
  SPOTIFY_SCOPES,
} from '@/spotify/constants';

export const useLogin = (): (() => Promise<void>) => {
  const router = useRouter();

  return async (): Promise<void> =>
    await SpotifyApi.performUserAuthorization(
      SPOTIFY_CLIENT_ID,
      REROUTE_HOME_URL,
      SPOTIFY_SCOPES,
      SPOTIFY_POSTBACK_URL,
    ).then(() => router.replace('/'));
};

export default useLogin;
