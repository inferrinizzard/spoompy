'use client';

import useLogin from '@/hooks/login';
import { Text } from '@/styles/primitives';

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
  const login = useLogin();

  return (
    <button onClick={() => login()} type="button">
      <Text fontSize={24}>{'Login'}</Text>
    </button>
  );
};

export default LoginButton;
