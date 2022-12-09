import SpotifyWebApiNode from 'spotify-web-api-node';

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
			new Array(Math.ceil(numPlaylists / 20))
				.fill(0)
				.map((_, i) =>
					spotify
						.getUserPlaylists(userId, { limit: 20, offset: 20 * i })
						.then(({ body }) => body.items)
				)
		).then(lists => lists.reduce((arr, list) => [...arr, ...list], []));
		allPlaylists = allPlaylists.filter(playlist => playlist.owner.id === userId);

		allPlaylists.forEach(playlist => console.log(playlist.name));
		console.log(allPlaylists.length);
	});
