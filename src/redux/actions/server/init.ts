"use server";

import { tryGetAuthSession } from "@/spotify/utils/getSession";

import store from "../../store";
import { setAuthStatus } from "../../slices/userSlice";

export const readAuthSession = (): void => {
	const authSession = tryGetAuthSession();
	const hasValidAccessToken = !!(
		authSession?.token_type && authSession?.expires > 0
	);

	console.info(`[Init] Reading stored auth status: ${hasValidAccessToken}`);
	store.dispatch(setAuthStatus(hasValidAccessToken));
};
