import React from 'react';
import Spotify, { Storage, wrapObj } from './Spotify';
import './css/App.css';

import Main from './Components/Main';

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));
export const SpotifyContext = React.createContext(spotify);

const App: React.FC = () => {
	const hostname = window.location.origin;
	if (window.location.hash && window.location.href.includes('redirect')) {
		const params = new URLSearchParams(window.location.hash);
		if (params.get('state') === Storage.state) {
			Storage.removeState();
			spotify.access_token = params.get('#access_token') ?? '';
			Storage.assignToken(spotify.access_token);
			spotify.setAccessToken(spotify.access_token);
			setTimeout(() => window.location.replace(hostname), 3000);
		} else if (Storage.state) {
			Storage.removeState();
			setTimeout(() => window.location.replace(hostname), 3000);
		}
	}

	return (
		<div className="App">
			<SpotifyContext.Provider value={spotify}>
				<Main />
			</SpotifyContext.Provider>
		</div>
	);
};

export default App;
