import type { JWT } from "next-auth/jwt";

import { authUrl } from "./spotifyProvider";

export async function refreshAccessToken(token: JWT) {
	try {
		const response = await fetch(authUrl, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});

		const refreshedToken = await response.json();

		if (!response.ok) {
			throw refreshedToken;
		}

		return {
			...token,
			access_token: refreshedToken.access_token,
			token_type: refreshedToken.token_type,
			expires: refreshedToken.expires_at,
			expires_in: (refreshedToken.expires_at ?? 0) - Date.now() / 1000,
			refresh_token: refreshedToken.refresh_token ?? token.refresh_token,
			scope: refreshedToken.scope,
		};
	} catch (error) {
		console.error(error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}
