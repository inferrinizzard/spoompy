import { type AccessToken } from "@spotify/web-api-ts-sdk";

import { getServerCookie } from "@/actions/cookies/serverCookies";

import { SPOTIFY_AUTH_COOKIE } from "../constants";

export const tryGetAuthSession = async (): Promise<AccessToken | null> => {
	const authSession = await getServerCookie<AccessToken>(SPOTIFY_AUTH_COOKIE);

	if (authSession) {
		if (authSession.expires > new Date().getTime()) {
			return authSession;
		}
	}

	return null;
};
