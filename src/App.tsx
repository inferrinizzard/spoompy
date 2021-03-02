import React, { useState } from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import Search from './Components/Search';

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));

type Artist = { name: string; id: string };
type Track = { artists: Artist[]; name: string; id?: string };
const maxArtists = 8;

const App: React.FC = () => {
	if (window.location.hash) {
		const params = new URLSearchParams(window.location.hash);
		if (params.get('state') === Storage.state) {
			Storage.removeState();
			spotify.access_token = params.get('#access_token') ?? '';
			Storage.assignToken(spotify.access_token);
			spotify.setAccessToken(spotify.access_token);
			window.location.replace(hostname);
		}
	}

	const [artists, setArtists] = useState(
		{} as { [id: string]: { name: string; tracks: Track[]; collaborators: Artist[] } }
	);
	const addArtist = (artist: string, name: string) =>
		(curr => curr.length < maxArtists && !curr.includes(artist))(Object.keys(artists)) &&
		spotify
			.getArtistAlbums(artist, { limit: 50 }) // limited to 50, need to loop
			.then(({ items }) => items.map(({ id }) => spotify.getAlbumTracks(id, { limit: 50 })))
			.then(x =>
				Promise.all(x).then(albums => {
					const tracks = albums.reduce(
						(tracks, { items }) => [
							...tracks,
							...items
								.map(({ artists, name, id }) => ({
									artists: artists.map(({ name, id }) => ({ name, id })),
									name,
									id,
								}))
								.filter(
									song =>
										song.artists.some(a => a.id === artist) &&
										!tracks.some(track => track.id === song.id)
								),
						],
						[] as Track[]
					);
					const collaborators = tracks
						.filter(track => track.artists.length > 1)
						.reduce(
							(acc, cur) => [
								...acc,
								...cur.artists.filter(a => a.id !== artist && !acc.some(ac => ac.id === a.id)),
							],
							[] as Artist[]
						);
					setArtists({
						...artists,
						[artist]: { name, tracks, collaborators },
					});
				})
			);

	// const tree = (root: string) => {
	// 	let graph = {};
	// 	const recurse = (id: string) => {
	// 		spotify
	// 		.getArtistAlbums(id)
	// 		.then(({ items }) => items.map(({ id }) => spotify.getAlbumTracks(id)))
	// 		.then(x =>
	// 			Promise.all(x).then(albums => albums.reduce((artists, tracks)=> [...artists], []))
	// 	};
	// };

	return (
		<div className="App">
			<Search spotify={spotify} addArtist={addArtist}></Search>
			{!Storage.accessToken && <button onClick={spotify.login}>login</button>}
			<button onClick={() => setArtists({})}>clear</button>
			<button
				onClick={async () => {
					let active = true;
					let time = +new Date();
					let i = 0;
					while (active) {
						console.log(i);
						await spotify.getMyRecentlyPlayedTracks({ limit: 50, before: time }).then(
							res => (console.log(res), (time = +res.cursors.after)), // eslint-disable-line no-loop-func
							() => (active = false) // eslint-disable-line no-loop-func
						);
						if (i++ > 10) active = false;
					}
				}}>
				a
			</button>
			<div style={{ position: 'fixed', width: '80vw', height: '100vh', right: 0 }}>
				{Object.entries(artists).map(([id, artist], i) => (
					<div key={i} style={{ width: `${100 / maxArtists}%`, display: 'inline-block' }}>
						<h5
							onClick={() =>
								setArtists(prev =>
									Object.entries(prev).reduce(
										(acc, [k, v]) => (k === id ? acc : { ...acc, [k]: v }),
										{}
									)
								)
							}>
							{artist.name}
						</h5>
						{/* <span>
						{artist.tracks
							.sort((a, b) => (a.name > b.name ? 1 : -1))
							.map(track => (
								<div key={track.id}>
									<span>{`${track.name} : ${track.id} w/${track.artists
										.map(a => a.name)
										.join(', ')}`}</span>
								</div>
							))}
					</span> */}
						<span>
							{artist.collaborators.map(a => (
								<div
									key={a.id}
									onClick={() => addArtist(a.id, a.name)}
									style={{ color: Object.keys(artists).includes(a.id) ? 'black' : 'gray' }}>
									{a.name}
								</div>
							))}
						</span>
						<span>{artist.tracks.length}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
