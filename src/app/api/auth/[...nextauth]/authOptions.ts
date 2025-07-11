import type { NextAuthOptions } from "next-auth";

import spotifyProvider from "./spotifyProvider";
import { refreshAccessToken } from "./refreshToken";

export const authOptions: NextAuthOptions = {
	providers: [spotifyProvider],
	callbacks: {
		// async redirect({ url, baseUrl }) {
		// 	// Allows relative callback URLs
		// 	if (url.startsWith("/")) return `${baseUrl}${url}`;
		// 	// Allows absolute callback URLs
		//  if (new URL(url).origin === baseUrl) return url;
		// 	return baseUrl;
		// },
		async jwt({ token, account, user }) {
			// Initial sign in
			if (account && user) {
				if (account.access_token) {
					token.access_token = account.access_token;
				}
				if (account.expires_at) {
					token.access_token_expires = Date.now() + account.expires_at * 1000;
				}
				if (account.refresh_token) {
					token.refresh_token = account.refresh_token;
				}
				return token;
			}

			// Return previous token if the access token has not expired yet
			if (
				token.access_token_expires &&
				Date.now() < token.access_token_expires
			) {
				return token;
			}

			// Access token has expired, try to update it
			return refreshAccessToken(token);
		},
		async session({ session, token }) {
			return {
				...session,
				token,
			};
		},
	},
};
