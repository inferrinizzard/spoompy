import { existsSync, writeFile } from 'fs';

/* eslint-disable no-loop-func */
import SpotifyWebApiNode from "spotify-web-api-node";

import { chunkedArray, mergeArrays, stripTrack } from './util.js';
import { getDirs } from './organise.js';

const filterExisting = (playlists: SpotifyApi.PlaylistObjectSimplified[], force=false) => {
	const dirs = getDirs()

}

const alreadyExists = (date:string, playlistName: string) => {
	const archiveDir = `archive/${date}`;

	getDirs


	// const exists = existsSync(`archive/${date}/${outputPlaylistName}.json`);
}


export const archivePlaylists = (spotify: SpotifyWebApiNode) => (userId: string, date: string, force = false) =>
	spotify
		.clientCredentialsGrant()
		.then(({ body: { access_token } }) => spotify.setAccessToken(access_token))
		.then(async () => {
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

			console.log('Found', numPlaylists, 'playlists', 'and', missing.length, 'missing');

			const missingPlaylists = await Promise.all(
				missing.map(id => spotify.getPlaylist(id).then(({ body }) => body))
			);

			for (const playlist of [...allPlaylists, ...missingPlaylists]) {
				const outputPlaylistName = playlist.name.replace(/ /g, '_').replace(':', '.').replace('?', 'Q');
				const exists = existsSync(`archive/${date}/${outputPlaylistName}.json`);

				if (exists && !force) {
					console.log(playlist.name, 'already exists, skipping')
					continue;
				}

				await new Promise(resolve => setTimeout(resolve, 5000));
				await spotify
					.getPlaylistTracks(playlist.id, { limit: 1 })
					.then(({ body }) => body.total)
					.then(numTracks =>
						Promise.all(
							chunkedArray(numTracks).map((_, i) =>
								spotify
									.getPlaylistTracks(playlist.id, { limit: 50, offset: 50 * i })
									.then(({ body }) => body.items)
							)
						)
					)
					.then(mergeArrays)
					.then(tracks => {
						const trackData = tracks.map(item => ({
							...stripTrack(item.track as SpotifyApi.TrackObjectFull),
							time: item.added_at,
							addedBy: item.added_by.id,
						}));
						writeFile(
							`archive/${date}/${outputPlaylistName}.json`,
							JSON.stringify(trackData),
							() => console.log(`Archived "${playlist.name}" with ${trackData.length} items`)
						);
				}
			});
