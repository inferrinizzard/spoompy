import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from "@/spotify/constants";

// async function refreshAcessToken(token) {
//     try {
//         spotifyApi.setAccessToken(token.accessToken)
//         spotifyApi.setRefreshToken(token.refreshToken)

//         const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
//         return {
//             ...token,
//             accessToken: refreshedToken.access_token,
//             accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
//             refreshToken: refreshedToken.refresh_token ?? token.refreshToken
//         }
//     } catch (error) {
//         console.error(error)
//         return {
//             ...token,
//             error: "refresh token error"
//         }
//     }
// }

const handler = NextAuth({
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
			if (account) {
				token.access_token = account.access_token;
			}
			return token;

			//  // initial sign in
			//       if (account && user) return {
			//           ...token,
			//           accessToken: account.access_token,
			//           refreshToken: account.refresh_token,
			//           username: account.providerAccountId,
			//           accessTokenExpires: account.expires_at * 1000
			//       }
			//       // token is valid
			//       if (Date.now() < token.accessTokenExpires) {
			//           return token;
			//       }

			//       // access token expires -> refresh the token
			//       return await refreshAcessToken(token)
		},
		async session({ session, token }) {
			return {
				...session,
				token,
			};
		},
	},
});

export { handler as GET, handler as POST };
