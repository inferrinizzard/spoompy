"use server";

import { getServerSession } from "@/auth/getServerSession";

import store from "../../store";
import { setAuthStatus } from "../../slices/userSlice";

export const readAuthSession = async (): Promise<void> => {
	const authSession = await getServerSession();
	const hasValidAccessToken = !!(
		authSession?.token.token_type && authSession?.token.expires > 0
	);

	console.info(`[Init] Reading stored auth status: ${hasValidAccessToken}`);
	store.dispatch(setAuthStatus(hasValidAccessToken));
};
