import React from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import PlaylistExplorer from './Components/PlaylistExplorer';

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));
export const SpotifyContext = React.createContext(spotify);

const App: React.FC = () => {
	if (window.location.hash && window.location.href.includes('redirect')) {
		const params = new URLSearchParams(window.location.hash);
		if (params.get('state') === Storage.state) {
			Storage.removeState();
			spotify.access_token = params.get('#access_token') ?? '';
			Storage.assignToken(spotify.access_token);
			spotify.setAccessToken(spotify.access_token);
			window.location.replace(hostname);
		} else if (Storage.state) {
			Storage.removeState();
			window.location.replace(hostname);
		}
	}

	return (
		<div className="App">
			<SpotifyContext.Provider value={spotify}>
				<Router>
					<Switch>
						<Route path="/home">
							{!Storage.accessToken && (
								<button onClick={() => spotify.login(window.location.origin + '/redirect')}>
									login
								</button>
							)}
						</Route>
						<Route path="/login"></Route>
						<Route path="/user">
							<div>test</div>
						</Route>
						<Route path="/listening"></Route>
						<Route path="/playlists">
							<PlaylistExplorer />
						</Route>
						<Route path="/redirect">
							{/* add redirect page and redirect programmatically after timeout */}
							{/* <Redirect push to={'home'} /> */}
						</Route>
						<Route>
							<Redirect push to={'home'} />
						</Route>
					</Switch>
				</Router>
			</SpotifyContext.Provider>
		</div>
	);
};

export default App;
