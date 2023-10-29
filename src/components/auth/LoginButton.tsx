'use client';

import { Button, Text } from '@kuma-ui/core';

import useLogin from '@/hooks/login';

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
  const login = useLogin();

  return (
    <Button onClick={() => login()}>
      <Text fontSize={24}>{'Login'}</Text>
    </Button>
  );
};

export default LoginButton;
