'use client';

import { useRouter } from 'next/navigation';
import { Button, Text } from '@kuma-ui/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

import {
  REROUTE_HOME_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_POSTBACK_URL,
  SPOTIFY_SCOPES,
} from '@/spotify/constants';

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() =>
        SpotifyApi.performUserAuthorization(
          SPOTIFY_CLIENT_ID,
          REROUTE_HOME_URL,
          SPOTIFY_SCOPES,
          SPOTIFY_POSTBACK_URL,
        ).then(() => router.refresh())
      }>
      <Text fontSize={24}>{'Login'}</Text>
    </Button>
  );
};

export default LoginButton;
