import React, { useState } from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import { loop, getTracks, getCollaborators, buildTree } from './SpotifyScripts';

import Nav from './Components/Nav';
import Search from './Components/Search';

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));
const maxArtists = 8;

const App: React.FC = () => {
	// move to redirect page
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

	const [artists, setArtists] = useState({} as ArtistGroup);
	const [tree, setTree] = useState({});
	const addArtist = (artist: string, name: string) =>
		(curr => curr.length < maxArtists && !curr.includes(artist))(Object.keys(artists)) &&
		loop(spotify.getArtistAlbums)(artist)
			.then(({ items }) =>
				Promise.all(items.map(({ id }) => spotify.getAlbumTracks(id, { limit: 50 })))
			)
			.then(albums =>
				Promise.all(
					getTracks(albums, artist).map(async track => ({
						...track,
						...(await spotify
							.getTrack(track.id)
							.then(({ album }) => spotify.getAlbum(album.id))
							.then(({ id: album, release_date }) => ({ album, release_date }))),
					}))
				)
			)
			.then(tracks => {
				const collaborators = getCollaborators(tracks, artist);
				const newArtists = { ...artists, [artist]: { name, tracks, collaborators } };
				setArtists(newArtists);
				setTree(buildTree(newArtists));
			});
	return (
		<div className="App">
			<Nav />
			<div
				style={{ position: 'absolute', top: '2rem', height: 'calc(100% - 4rem)', width: '100%' }}>
				<div
					style={{ display: 'inline-block', width: '20%', height: '100%', position: 'relative' }}>
					<Search spotify={spotify} addArtist={addArtist}></Search>
				</div>
				<div
					style={{
						display: 'inline-block',
						width: '80%',
						height: '100%',
						position: 'relative',
						overflowY: 'scroll',
					}}>
					<div style={{ position: 'absolute', top: 0 }}>
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
							test recent history
						</button>
					</div>
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
		</div>
	);
};

export default App;
