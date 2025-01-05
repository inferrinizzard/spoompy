import SpotifyWebApiNode from "spotify-web-api-node";

import { exit } from "process";
import { createServer } from "http";
import { writeFile } from "fs";
import open from "open";

export const archiveSaved = (spotify: SpotifyWebApiNode) => (date: string) => {
	const scopes = ["user-library-read"];
	const authorizeURL = spotify.createAuthorizeURL(scopes, "state", true);
	open(authorizeURL);

	const getSongs = async () => {
		const numTracks = await spotify
			.getMySavedTracks({ limit: 1 })
			.then(({ body }) => body.total);
		const baseTracks = await Promise.all(
			new Array(Math.ceil(numTracks / 50))
				.fill(0)
				.map((_, i) =>
					spotify
						.getMySavedTracks({ limit: 50, offset: i * 50 })
						.then(({ body }) => body.items),
				),
		).then((lists) => lists.reduce((arr, list) => [...arr, ...list], []));

		const tracks = baseTracks.map((item) => ({
			name: item.track.name,
			artists: item.track.artists.map((artist) => artist.name).join(", "),
			album: item.track.album.name,
			id: item.track.id,
			time: item.added_at,
		}));
		writeFile(`archive/${date}/saved.json`, JSON.stringify(tracks), () => {
			console.log(`Archived saved songs with ${numTracks} tracks`);
			server.close();
			exit(0);
		});
	};

	const server = createServer({}, (req, res) => {
		if (req.url === "/") {
			res.writeHead(200);
		}
		if (req.url && req.url.includes("code")) {
			const code = new URLSearchParams(req.url.slice(1)).get("code")!;
			spotify.authorizationCodeGrant(code).then(({ body }) => {
				spotify.setAccessToken(body.access_token);
				getSongs();
			});
		}
		res.end();
	}).listen(8000);
};
