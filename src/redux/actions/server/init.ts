"use server";

import { tryGetAuthSession } from "@/spotify/utils/getSession";

import store from "../../store";
import { setAuthStatus } from "../../slices/userSlice";

export const readAuthSession = async (): Promise<void> => {
	const authSession = await tryGetAuthSession();
	const hasValidAccessToken = !!(
		authSession?.token_type && authSession?.expires > 0
	);

	console.info(`[Init] Reading stored auth status: ${hasValidAccessToken}`);
	store.dispatch(setAuthStatus(hasValidAccessToken));
};
