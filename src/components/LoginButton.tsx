'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('code')) {
      SpotifyApi.performUserAuthorization(
        SPOTIFY_CLIENT_ID,
        REROUTE_HOME_URL,
        SPOTIFY_SCOPES,
        SPOTIFY_POSTBACK_URL,
      );
    }
  }, []);

  return (
    <Button
      onClick={() =>
        SpotifyApi.performUserAuthorization(
          SPOTIFY_CLIENT_ID,
          REROUTE_HOME_URL,
          SPOTIFY_SCOPES,
          SPOTIFY_POSTBACK_URL,
        )
      }>
      <Text fontSize={24}>{'Login'}</Text>
    </Button>
  );
};

export default LoginButton;
