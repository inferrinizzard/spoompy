import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import Spotify from './Spotify';
import './App.css';

import Search from './Components/Search';

// redirect on click.login, catch & fetch code → fetch token, store & redirect again
const spotify = new Spotify('104889eeeb724a9ca5efa673f527f38f');

const App: React.FC = () => {
	// const spotify = new SpotifyWebApi();

	return (
		<div className="App">
			<Search></Search>
		</div>
	);
};

export default App;
