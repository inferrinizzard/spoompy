'use client';

import { useEffect } from 'react';
import { Button, Text } from '@kuma-ui/core';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { cookies } from 'next/headers';

import { SPOTIFY_AUTH_COOKIE, SPOTIFY_SCOPES } from '@/spotify/constants';

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('code')) {
      SpotifyApi.performUserAuthorization(
        '104889eeeb724a9ca5efa673f527f38f',
        'http://localhost:3000',
        SPOTIFY_SCOPES,
        'http://localhost:3000/api/postback',
      );
    }
  }, []);

  return (
    <Button
      onClick={() =>
        SpotifyApi.performUserAuthorization(
          '104889eeeb724a9ca5efa673f527f38f',
          'http://localhost:3000',
          SPOTIFY_SCOPES,
          'http://localhost:3000/api/postback',
        )
      }>
      <Text fontSize={24}>{'Login'}</Text>
    </Button>
  );
};

export default LoginButton;
