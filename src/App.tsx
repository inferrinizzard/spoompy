import React from 'react';
import Spotify from './Spotify';
import './App.css';

import Search from './Components/Search';

const spotify = new Spotify('104889eeeb724a9ca5efa673f527f38f');

const App: React.FC = () => {
	if (window.location.hash) {
		const params = new URLSearchParams(window.location.hash);
		if (params.get('state') === sessionStorage.getItem('spoompy-state')) {
			sessionStorage.removeItem('spoompy-state');
			spotify.access_token = params.get('#access_token') ?? '';
			sessionStorage.setItem('spoompy-access_token', spotify.access_token);
			spotify.setAccessToken(spotify.access_token);
		}
	}

	return (
		<div className="App">
			<Search></Search>
			<button onClick={spotify.login}>login</button>
			<button onClick={() => spotify.searchArtists('city girl').then(res => console.log(res))}>
				test
			</button>
		</div>
	);
};

export default App;
