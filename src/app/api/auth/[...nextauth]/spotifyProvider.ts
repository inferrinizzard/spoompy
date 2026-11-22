import SpotifyProvider from "next-auth/providers/spotify";

import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES } from "@/spotify/constants";

const spotifyProvider = SpotifyProvider({
	clientId: SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_SECRET ?? "",
	authorization: {
		params: { scope: SPOTIFY_SCOPES.join(",") },
	},
});

export default spotifyProvider;

export const authUrl = new URL("https://accounts.spotify.com/authorize");
authUrl.searchParams.append("scope", SPOTIFY_SCOPES.join(" "));
