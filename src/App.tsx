import React, { useState } from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import { loop, getTracks, getCollaborators, timestampSort, buildTimeline } from './SpotifyScripts';

import Nav from './Components/Nav';
import Search from './Components/Search';
import Tree from './Components/Tree';

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
	const [timeline, setTimeline] = useState({} as Timeline);
	const addArtist = (artist: string, name: string) =>
		(curr => curr.length < maxArtists && !curr.includes(artist))(Object.keys(artists)) &&
		loop(spotify.getArtistAlbums)(artist)
			.then(({ items }) =>
				Promise.all(
					items.map(async ({ name, id, images }) => ({
						name,
						id,
						img: images?.shift()?.url ?? '',
						tracks: await spotify.getAlbumTracks(id, { limit: 50 }),
					}))
				)
			)
			.then(
				albums =>
					(async () => [
						albums,
						(
							await Promise.all(
								(list =>
									[...new Array(Math.ceil(list.length / 20))].map((_, i) =>
										list.slice(i * 20, (i + 1) * 20)
									))(albums.map(({ id }) => id)).map(chunk => spotify.getAlbums(chunk))
							)
						)
							.reduce((acc, { albums }) => [...acc, ...albums], [] as SpotifyApi.AlbumObjectFull[])
							.reduce((acc, { id, release_date }) => ({ ...acc, [id]: release_date }), {}),
					])() as Promise<[typeof albums, { [id: string]: string }]>
			)
			.then(([_albums, dates]) => {
				const albums = _albums.map(({ id, name, img, tracks }) => ({
					id,
					name,
					img,
					tracks: getTracks(tracks, artist),
					release_date: dates[id],
				}));
				const collaborators = getCollaborators(
					albums.reduce((tracks, album) => [...tracks, ...album.tracks], [] as Track[]),
					artist
				);
				const newArtists = {
					...artists,
					[artist]: { name, albums: albums.sort(timestampSort), collaborators },
				};
				setArtists(newArtists);
				setTimeline(prev => buildTimeline(prev, newArtists));
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
					<div style={{ position: 'absolute', top: 0, width: '100%' }}>
						<div>
							{!Storage.accessToken && <button onClick={spotify.login}>login</button>}
							<button onClick={() => (setArtists({}), setTimeline({}))}>clear</button>
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
							<button
								onClick={() => {
									if (!artists['0gKR8NI5vgeG9kCyt8q06v'])
										addArtist('0gKR8NI5vgeG9kCyt8q06v', 'Ryce');
									else if (!artists['1OgLpkhh88FmT6Jyx7eDHY'])
										addArtist('1OgLpkhh88FmT6Jyx7eDHY', 'Garrett.');
									else if (!artists['1dtZllLT0EINXgSftEnOjv'])
										addArtist('1dtZllLT0EINXgSftEnOjv', 'Atwood');
									else if (!artists['2K7iE9Z2ySIBKsG8UnG8PR'])
										addArtist('2K7iE9Z2ySIBKsG8UnG8PR', 'Colliding With Mars');
									else if (!artists['3CIq9N0VQGWfBpCAMzMZZN'])
										addArtist('3CIq9N0VQGWfBpCAMzMZZN', 'again&again');
									else if (!artists['40DgzqFfLrkIx2mas3Bpfv'])
										addArtist('40DgzqFfLrkIx2mas3Bpfv', 'juicebox caviar');
									else if (!artists['4OeVEA18McK3X8qrYaxw4D'])
										addArtist('4OeVEA18McK3X8qrYaxw4D', 'Bluknight');
									else if (!artists['6c2imUuGk5LXiyJICv0sdf'])
										addArtist('6c2imUuGk5LXiyJICv0sdf', 'planet girl');
								}}>
								test
							</button>
						</div>
						<div style={{ width: '100%' }}>
							{Object.entries(artists).map(([id, { name }], i) => (
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
										{name}
									</h5>
								</div>
							))}
						</div>
					</div>
					<Tree timeline={timeline} artists={artists} />
					{/* {Object.entries(artists).map(([id, artist], i) => (
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
							<span>{artist.albums.length}</span>
						</div>
					))} */}
				</div>
			</div>
		</div>
	);
};

export default App;
