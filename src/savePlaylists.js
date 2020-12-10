import SpotifyWebApi from 'spotify-web-api-js';
import SpotifyWebApiNode from 'spotify-web-api-node';
import { execSync } from 'child_process';
import { writeFile, readFileSync } from 'fs';

let creds = {
	id: '104889eeeb724a9ca5efa673f527f38f',
	secret: '43a9defb061a4d1894242d3a09271b5c',
};

let tokenHash = Buffer.from(Object.values(creds).join(':')).toString('base64');
let accessTokenCmd = `curl -X "POST" -H "Authorization: Basic ${tokenHash}" -d grant_type=client_credentials https://accounts.spotify.com/api/token`;
let token = JSON.parse(Buffer.from(execSync(accessTokenCmd)).toString()).access_token;

let userId = 12121954989;

var spotify = new SpotifyWebApiNode({
	clientId: creds.id,
	clientSecret: creds.secret,
});
// let spotify = new SpotifyWebApi();
spotify.setAccessToken(token);

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

async function run() {
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
				else writeFile(`${i++}.json`, JSON.stringify(output), e => console.error(e));
			},
			e => console.error(e)
		);
	} while (finalOut);
	writeFile(
		'playlists.json',
		JSON.stringify(
			new Array(i)
				.fill(0)
				.map((_, k) => k)
				.reduce(
					(acc, k) => [...acc, ...JSON.parse(Buffer.from(readFileSync(`${k}.json`)).toString())],
					[]
				)
		),
		e => console.error(e)
	);
}
run();
