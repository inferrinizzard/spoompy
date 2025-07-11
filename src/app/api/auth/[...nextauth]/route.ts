import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from "@/spotify/constants";

export async function refreshAccessToken(token: JWT) {
	try {
		const response = await fetch(authURL, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
		});

		const refreshedTokens = await response.json();

		if (!response.ok) {
			throw refreshedTokens;
		}

		return {
			...token,
			access_token: refreshedTokens.access_token,
			token_type: refreshedTokens.token_type,
			expires_at: refreshedTokens.expires_at,
			expires_in: (refreshedTokens.expires_at ?? 0) - Date.now() / 1000,
			refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
			scope: refreshedTokens.scope,
		};
	} catch (error) {
		console.error(error);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_SECRET ?? "",
			authorization: {
				params: { scope: SPOTIFY_SCOPES.join(",") },
			},
		}),
	],
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
				token.user = user;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
