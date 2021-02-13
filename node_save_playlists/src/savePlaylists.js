import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebApiNode from 'spotify-web-api-node';
import { writeFile, readFileSync, unlink as removeFile } from 'fs';

const continuousArray = i => new Array(i).fill(0).map((_, k) => k);
const tempFileName = x => `playlistTemp_${x}.json`;

let creds = JSON.parse(readFileSync('src/creds.json').toString());
let userId = 12121954989;

// let spotify = new SpotifyWebApi({
let spotify = new SpotifyWebApiNode({
	clientId: creds.id,
	clientSecret: creds.secret,
});

// Promise.all(
// 	new Array(99)
// 		.fill(99)
// 		.map((x, i) => x - i)
// 		.map(num =>
// 			spotify
// 				.getUserPlaylists(userId + '', { limit: num })
// 				.then(_ => num)
// 				.catch(_ => null)
// 		)
// )
// 	.then(res => {
// 		let numPlaylists = res.find(num => num);
// 		console.log(numPlaylists);
// 	})
// 	.catch(e => console.log(e));

spotify
	.clientCredentialsGrant()
	.then(({ body: { access_token } }) => spotify.setAccessToken(access_token))
	.then(async () => {
		let i = 0;
		let finalOut = true;
		do {
			await spotify.getUserPlaylists(userId + '', { limit: 50, offset: 50 * i }).then(
				async res => {
					let playlists = res.body.items;
					let output = await Promise.all(
						playlists.map(async playlist => {
							let data = (({ name, description, id }) => ({ name, description, id, tracks: [] }))(
								playlist
							);
							data.tracks = await spotify.getPlaylistTracks(data.id).then(tracks =>
								tracks.body.items.map(song =>
									(({ is_local, added_at, track: { artists, album, id, name } }) => ({
										name,
										id,
										added_at,
										is_local,
										artists: artists.map(({ name, id }) => ({ name, id })),
										album: (({ name, id }) => ({ name, id }))(album),
									}))(song)
								)
							);
							return data;
						})
					);
					if (output.length == 0) finalOut = false;
					else writeFile(tempFileName(i++), JSON.stringify(output), e => console.error(e));
				},
				e => console.error(e)
			);
		} while (finalOut);
		let is = continuousArray(i);
		writeFile(
			'playlists.json',
			JSON.stringify(
				is.reduce(
					(acc, k) => [
						...acc,
						...JSON.parse(Buffer.from(readFileSync(tempFileName(k))).toString()),
					],
					[]
				)
			),
			e => console.error(e)
		);
		is.forEach(k => removeFile(tempFileName(k), e => console.error(e)));
	});
