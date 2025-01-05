import { writeFile } from "node:fs";

import type SpotifyWebApiNode from "spotify-web-api-node";

import { chunkedArray, mergeArrays, stripTrack } from "./util.js";

export const formatPlaylistName = (playlistName: string) =>
	playlistName.replace(/ /g, "_").replace(":", ".").replace("?", "Q");

export const getPlaylists = async (
	spotify: SpotifyWebApiNode,
	userId: string,
) => {
	await spotify.clientCredentialsGrant().then(({ body: { access_token } }) => {
		spotify.setAccessToken(access_token);
		return spotify;
	});

	const numPlaylists = await spotify
		.getUserPlaylists(userId, { limit: 1 })
		.then(({ body }) => body.total);

	let allPlaylists = await Promise.all(
		chunkedArray(numPlaylists).map((_, i) =>
			spotify
				.getUserPlaylists(userId, { limit: 50, offset: 50 * i })
				.then(({ body }) => body.items),
		),
	).then(mergeArrays);
	allPlaylists = allPlaylists.filter(
		(playlist) => playlist.owner.id === userId,
	);

	const missing = [
		"6TCDIbwJ2riDAzBZvPQemA",
		"5S1Z6XNm6vcmg1XjVmMTs8",
		"59eqoXLSr70895rmC39KRM",
		"3LSNpPkGf8x28X860VHyFJ",
	];

	const missingPlaylists = await Promise.all(
		missing.map((id) => spotify.getPlaylist(id).then(({ body }) => body)),
	);

	console.log(`Found ${numPlaylists} playlists and ${missing.length} missing`);

	return [...allPlaylists, ...missingPlaylists];
};

export const downloadPlaylist = async (
	spotify: SpotifyWebApiNode,
	playlist: SpotifyApi.PlaylistObjectSimplified,
	date: string,
) => {
	const outputPlaylistName = formatPlaylistName(playlist.name);

	const numTracks = await spotify
		.getPlaylistTracks(playlist.id, { limit: 1 })
		.then(({ body }) => body.total);

	const playlistTrackChunkPromises = Promise.all(
		chunkedArray(numTracks).map((_, i) =>
			spotify
				.getPlaylistTracks(playlist.id, {
					limit: 50,
					offset: 50 * i,
				})
				.then(({ body }) => body.items),
		),
	);

	const allTracks = mergeArrays(await playlistTrackChunkPromises);
	const trackData = allTracks.map((item) => ({
		...stripTrack(item.track as SpotifyApi.TrackObjectFull),
		time: item.added_at,
		addedBy: item.added_by.id,
	}));

	writeFile(
		`archive/${date}/${outputPlaylistName}.json`,
		JSON.stringify(trackData),
		() =>
			console.log(`Archived "${playlist.name}" with ${trackData.length} items`),
	);
};
