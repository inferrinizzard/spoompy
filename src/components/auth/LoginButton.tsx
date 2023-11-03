'use client';

import useLogin from '@/hooks/login';

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
  const login = useLogin();

  return (
    <button onClick={() => login()} type="button">
      <h1
      // fontSize={24}
      >
        {'Login'}
      </h1>
    </button>
  );
};

export default LoginButton;
