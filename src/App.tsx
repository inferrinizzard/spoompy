import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Spotify from './Spotify';
import './App.css';

import Search from './Components/Search';

// redirect on click.login, catch & fetch code → fetch token, store & redirect again
const spotify = new Spotify('104889eeeb724a9ca5efa673f527f38f');

const App: React.FC = () => {
	if (window.location.search) {
		const params = new URLSearchParams(window.location.search);
		if (params.get('state') === sessionStorage.getItem('spoompy-state')) {
			sessionStorage.removeItem('spoompy-state');
			if (params.get('error')) {
			} else {
				const activation_code = params.get('code') ?? '';
				spotify.getAccessToken(activation_code);
			}
		}
	}
	// const spotify = new SpotifyWebApi();

	return (
		<div className="App">
			<Search></Search>
			<button onClick={spotify.login}>login</button>
		</div>
	);
};

export default App;
