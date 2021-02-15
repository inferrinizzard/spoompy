import React, { useState } from 'react';
import Spotify, { hostname, stateName, accessTokenName } from './Spotify';
import './App.css';

import Search from './Components/Search';

const spotify = new Spotify('104889eeeb724a9ca5efa673f527f38f');

type Artist = { name: string; id: string };
type Track = { artists: Artist[]; name: string; id?: string };

const App: React.FC = () => {
	if (window.location.hash) {
		const params = new URLSearchParams(window.location.hash);
		if (params.get('state') === sessionStorage.getItem(stateName)) {
			sessionStorage.removeItem(stateName);
			spotify.access_token = params.get('#access_token') ?? '';
			sessionStorage.setItem(accessTokenName, spotify.access_token);
			spotify.setAccessToken(spotify.access_token);
			window.location.replace(hostname);
		}
	}

	const [artists, setArtists] = useState({} as { [id: string]: Track[] });

	return (
		<div className="App">
			<Search
				spotify={spotify}
				addArtist={artist => {
					(curr => curr.length < 5 && !curr.includes(artist))(Object.keys(artists)) &&
						spotify
							.getArtistAlbums(artist)
							.then(({ items }) => items.map(({ id }) => spotify.getAlbumTracks(id)))
							.then(x =>
								Promise.all(x).then(albums =>
									setArtists({
										...artists,
										[artist]: albums.reduce(
											(tracks, { items }) => [
												...tracks,
												...items
													.map(({ artists, name, id }) => ({
														artists: artists.map(({ name, id }) => ({ name, id })),
														name,
														id,
													}))
													.filter(song => !tracks.some(track => track.id === song.id)),
											],
											[] as Track[]
										),
									})
								)
							);
				}}></Search>
			{!spotify.access_token && <button onClick={spotify.login}>login</button>}
			{Object.values(artists).map((tracks, i) => (
				<div key={i}>
					{tracks
						.sort((a, b) => (a.name > b.name ? 1 : -1))
						.map(track => (
							<div key={track.id}>
								<span>{`${track.name} : ${track.id} w/${track.artists.length} artists`}</span>
							</div>
						))}
					<span>{tracks.length}</span>
				</div>
			))}
			<button onClick={() => setArtists({})}>clear</button>
		</div>
	);
};

export default App;
