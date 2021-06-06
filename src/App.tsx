import React, { useState } from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import PlaylistExplorer from './Components/PlaylistExplorer';

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));
export const SpotifyContext = React.createContext(spotify);

const App: React.FC = () => {
	const [connected, setConnected] = useState(!!spotify.access_token);

	// move to redirect page
	if (window.location.hash) {
		const params = new URLSearchParams(window.location.hash);
		if (params.get('state') === Storage.state) {
			Storage.removeState();
			spotify.access_token = params.get('#access_token') ?? '';
			Storage.assignToken(spotify.access_token);
			spotify.setAccessToken(spotify.access_token);
			setConnected(true);
			window.location.replace(hostname);
		} else if (Storage.state) {
			Storage.removeState();
			window.location.replace(hostname);
			setConnected(false);
		}
	}

	return (
		<div className="App">
			<SpotifyContext.Provider value={spotify}>
				{!Storage.accessToken && <button onClick={spotify.login}>login</button>}
				<PlaylistExplorer connected={connected} />
			</SpotifyContext.Provider>
		</div>
	);
};

export default App;
