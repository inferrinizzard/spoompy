import { useRouter } from 'next/navigation';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

import {
  HOME_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_POSTBACK_URL,
  SPOTIFY_SCOPES,
} from '@/spotify/constants';

export const useLogin = (): (() => Promise<void>) => {
  const router = useRouter();

  return async (): Promise<void> =>
    await SpotifyApi.performUserAuthorization(
      SPOTIFY_CLIENT_ID,
      HOME_URL,
      SPOTIFY_SCOPES,
      SPOTIFY_POSTBACK_URL,
    )
      .then(() => router.replace('/'))
      .then(() => router.refresh());
};

export default useLogin;
