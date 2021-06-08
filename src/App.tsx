import React from 'react';
import Spotify, { Storage, wrapObj } from './Spotify';
import './css/App.css';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import PlaylistExplorer from './Components/PlaylistExplorer';
import ListeningExplorer from './Components/ListeningExplorer';
import Drawer from './Components/Drawer';
import { DisplayArtists } from './Components/DisplayTop';

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));
export const SpotifyContext = React.createContext(spotify);

const theme = {
	green: '#1db954',
	lightgreen: '#1ed760',
	black: '#191414',
	dark: '#181818',
	lightgray: '#b2b2b2',
	white: '#fff',
};

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
				<ThemeProvider theme={theme}>
					<div className="base" style={{ backgroundColor: theme.dark }}>
						<Router>
							<Drawer />
							<div style={{ marginLeft: '15%', width: '85%', height: '100%', overflowX: 'hidden' }}>
								{/* overflow for scroll bar width */}
								<div className="header"></div>
								<Switch>
									<Route path="/home">
										{!spotify.connected && (
											<button onClick={() => spotify.login(hostname + '/redirect')}>login</button>
										)}
										<button onClick={() => (Storage.removeToken(), Storage.removeState())}>
											Reset
										</button>
									</Route>
									<Route path="/login"></Route>
									<Route path="/user">
										<div>test</div>
									</Route>
									<Route path="/top/artists">
										<DisplayArtists />
									</Route>
									<Route path="/top/tracks">
										<div>top tracks</div>
									</Route>
									<Route path="/listening">
										<ListeningExplorer />
									</Route>
									<Route path="/playlists">
										<PlaylistExplorer />
									</Route>
									<Route path="/redirect">
										<div>this is the redirect page</div>
										<div>you will be redirected in 3 seconds</div>
									</Route>
									<Route>
										<Redirect push to={'/home'} />
									</Route>
								</Switch>
							</div>
						</Router>
					</div>
				</ThemeProvider>
			</SpotifyContext.Provider>
		</div>
	);
};

export default App;
