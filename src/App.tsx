import React from 'react';
import Spotify, { Storage, wrapObj } from './Spotify';
import './css/App.css';

import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

import Main from './Components/Main';

const theme = {
	green: '#1db954',
	lightgreen: '#1ed760',
	black: '#191414',
	dark: '#181818',
	lightgray: '#b2b2b2',
	white: '#fff',
};

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
		<div className="App" style={{ backgroundColor: theme.dark }}>
			<SpotifyContext.Provider value={spotify}>
				<ThemeProvider theme={theme}>
					<Router>
						<Main />
					</Router>
				</ThemeProvider>
			</SpotifyContext.Provider>
		</div>
	);
};

export default App;
