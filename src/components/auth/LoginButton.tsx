"use client";

import useLogin from "@/hooks/login";
import { Button, Text } from "@/styles/primitives";

export interface LoginButtonProps {}

export const LoginButton: React.FC<LoginButtonProps> = () => {
	const login = useLogin();

	return (
		<Button onClick={() => login()}>
			<Text fontSize={24}>{"Login"}</Text>
		</Button>
	);
};

export default LoginButton;
