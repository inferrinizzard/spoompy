import SpotifyWebApiNode from 'spotify-web-api-node';
import { exit } from 'process';
import { createServer } from 'http';
import { readFile, writeFile } from 'fs';
import open from 'open';

let spotify = new SpotifyWebApiNode({
	clientId: creds.id,
	clientSecret: creds.secret,
	redirectUri: 'http://localhost:8000',
});

let scopes = ['user-library-read'];
let authorizeURL = spotify.createAuthorizeURL(scopes, 'state', true, 'token');
open(authorizeURL);

const E = e => (console.error(e), exit());

async function getSongs() {
	let tracks = [];
	let i = 0;
	let cont = true;
	do {
		await spotify.getMySavedTracks({ limit: 50, offset: 50 * i++ }).then(
			({ body: { items } }) => (
				items.length == 0 && (cont = false),
				(tracks = [
					...tracks,
					...items.map(({ added_at, track: { artists, album, id, name, is_local } }) => ({
						name,
						id,
						added_at,
						is_local,
						artists: artists.map(({ name, id }) => ({ name, id })),
						album: (({ name, id }) => ({ name, id }))(album),
					})),
				])
			),
			E
		);
	} while (cont);
	writeFile('saved.json', JSON.stringify(tracks), E);
	// .then(() => exit());
}

let server = createServer({}, (req, res) => {
	if (req.url == '/')
		readFile('src/index.html', (e, file) =>
			e ? (console.error(e), e) : (res.writeHead(200), res.end(file))
		);
	if (req.url.includes('access_token')) {
		let token = req.url.split('&')[0].split('=')[1];
		spotify.setAccessToken(token);

		getSongs().then(() => (server.close(), exit()));
		res.end();
	}
}).listen(8000);

// spotify
// 	.clientCredentialsGrant()
// 	.then(({ body: { access_token } }) => spotify.setAccessToken(access_token));
