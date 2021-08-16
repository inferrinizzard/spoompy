import React from 'react';
import Spotify, { Storage } from 'Spotify';
import 'css/App.scss';
import theme from 'css/colours.module.scss';

import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

import Main from 'Components/Main';

const spotify = Spotify('104889eeeb724a9ca5efa673f527f38f');
export const SpotifyContext = React.createContext(spotify);

const App: React.FC = () => {
	const hostname = window.location.origin;
	if (window.location.hash && window.location.href.includes('redirect')) {
		const params = new URLSearchParams(window.location.hash);
		if (Storage.state) {
			if (params.get('state') === Storage.state) {
				spotify.accessToken = params.get('#access_token') ?? '';
				Storage.assignToken(spotify.accessToken);
				spotify.setAccessToken(spotify.accessToken);
			}
			Storage.removeState();

			const restoreUri = Storage.getItem(Storage.restoreName);
			if (restoreUri) {
				Storage.removeItem(Storage.restoreName);
				window.location.replace(restoreUri);
			} else window.location.replace(hostname);
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
