/* eslint-disable no-loop-func */
import SpotifyWebApiNode from 'spotify-web-api-node';

import { writeFile } from 'fs';
import { chunkedArray, mergeArrays, stripTrack } from './util';

export const archivePlaylists = (spotify: SpotifyWebApiNode) => (userId: string) =>
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
						.then(({ body }) => body.items)
				)
			).then(mergeArrays);
			allPlaylists = allPlaylists.filter(playlist => playlist.owner.id === userId);

			const missing = [
				'6TCDIbwJ2riDAzBZvPQemA',
				'5S1Z6XNm6vcmg1XjVmMTs8',
				'59eqoXLSr70895rmC39KRM',
				'3LSNpPkGf8x28X860VHyFJ',
			];

			const missingPlaylists = await Promise.all(
				missing.map(id => spotify.getPlaylist(id).then(({ body }) => body))
			);

			for (const playlist of [...allPlaylists, ...missingPlaylists]) {
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
							`archive/2022-12-09/${playlist.name.replace(/ /g, '_').replace(':', '.')}.json`,
							JSON.stringify(trackData),
							() => console.log(`Archived "${playlist.name}" with ${trackData.length} items`)
						);
					})
					.catch(e => console.log(`Error while archiving: "${playlist.name}"`, e));
			}
		});
