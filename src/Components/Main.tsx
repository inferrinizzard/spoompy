import React, { useContext } from 'react';
import { Storage } from '../Spotify';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { SpotifyContext } from '../App';
import PlaylistExplorer from './PlaylistExplorer';
import ListeningExplorer from './ListeningExplorer';
import Drawer from './Drawer';

import TopArtists from './TopArtists';
import TopTracks from './TopTracks';

const theme = {
	green: '#1db954',
	lightgreen: '#1ed760',
	black: '#191414',
	dark: '#181818',
	lightgray: '#b2b2b2',
	white: '#fff',
};

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	const spotify = useContext(SpotifyContext);

	return (
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
									<button onClick={() => spotify.login(window.location.origin + '/redirect')}>
										login
									</button>
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
								<TopArtists />
							</Route>
							<Route path="/top/tracks">
								<TopTracks />
							</Route>
							<Route path="/listening">
								<ListeningExplorer />
							</Route>
							<Route path="/playlists">
								<PlaylistExplorer />
							</Route>
							<Route path="/redirect">
								<div style={{ color: 'white' }}>this is the redirect page</div>
								<div style={{ color: 'white' }}>you will be redirected in 3 seconds</div>
							</Route>
							<Route>
								<Redirect push to={'/home'} />
							</Route>
						</Switch>
					</div>
				</Router>
			</div>
		</ThemeProvider>
	);
};

export default Main;
