"use client";

import useLogin from "@/hooks/login";
import { Button, Text } from "@/styles/primitives";

import { signIn } from "next-auth/react";

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
	// const login = useLogin();

	return (
		<Button onClick={() => signIn()}>
			<Text fontSize={24}>{"Login"}</Text>
		</Button>
	);
};

export default LoginButton;
