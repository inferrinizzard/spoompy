/* eslint-disable no-loop-func */
/// <reference types="@types/spotify-api" />
import SpotifyWebApiNode from 'spotify-web-api-node';
import { writeFile } from 'fs';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const userId = (12121954989).toString();
const spotify = new SpotifyWebApiNode({
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
});

spotify
	.clientCredentialsGrant()
	.then(({ body: { access_token } }) => spotify.setAccessToken(access_token))
	.then(async () => {
		const numPlaylists = await spotify
			.getUserPlaylists(userId, { limit: 1 })
			.then(({ body }) => body.total);

		let allPlaylists = await Promise.all(
			new Array(Math.ceil(numPlaylists / 50))
				.fill(0)
				.map((_, i) =>
					spotify
						.getUserPlaylists(userId, { limit: 50, offset: 50 * i })
						.then(({ body }) => body.items)
				)
		).then(lists => lists.reduce((arr, list) => [...arr, ...list], []));
		allPlaylists = allPlaylists.filter(playlist => playlist.owner.id === userId);

		for (const playlist of allPlaylists) {
			await new Promise(resolve => setTimeout(resolve, 5000));
			await spotify
				.getPlaylistTracks(playlist.id, { limit: 1 })
				.then(({ body }) => body.total)
				.then(numTracks =>
					Promise.all(
						new Array(Math.ceil(numTracks / 50))
							.fill(0)
							.map((_, i) =>
								spotify
									.getPlaylistTracks(playlist.id, { limit: 50, offset: 50 * i })
									.then(({ body }) => body.items)
							)
					)
				)
				.then(lists => lists.reduce((arr, list) => [...arr, ...list], []))
				.then(tracks => {
					const trackData = tracks.map(item => {
						const track = item.track as SpotifyApi.TrackObjectFull;
						return {
							name: track.name,
							artists: track.artists.map(artist => artist.name).join(', '),
							album: track.album.name,
							id: track.id,
							time: item.added_at,
							addedBy: item.added_by.id,
						};
					});
					writeFile(
						`archive/2022-12-09/${playlist.name.replace(/ /g, '_')}.json`,
						JSON.stringify(trackData),
						() => console.log(`Archived "${playlist.name}" with ${trackData.length} items`)
					);
				})
				.catch(e => console.log(`Error while archiving: "${playlist.name}"`, e));
		}
	});
