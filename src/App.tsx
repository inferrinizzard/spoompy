import React, { useState } from 'react';
import Spotify, { hostname, stateName, accessTokenName } from './Spotify';
import './App.css';

import Search from './Components/Search';

const spotify = new Spotify('104889eeeb724a9ca5efa673f527f38f');

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

	// const [artists, setArtists] = useState([] as SpotifyApi.SingleArtistResponse[]);

	return (
		<div className="App">
			<Search
				spotify={spotify}
				addArtist={artist => {
					// (
					// artists.length < 5 &&
					// 	!artists.some(({ id }) => id === artist) &&
					// 	spotify.getArtist(artist).then(a => (console.log(a), setArtists([...artists, a])))
					// )
				}}></Search>
			{!spotify.access_token && <button onClick={spotify.login}>login</button>}
			{/* {artists.map(a => (
				<h1>{a}</h1>
			))} */}
		</div>
	);
};

export default App;
