import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Storage } from '../Spotify';
import { loop } from '../SpotifyScripts';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { SpotifyContext } from '../App';
import PlaylistExplorer from './PlaylistExplorer';
import ListeningExplorer from './ListeningExplorer';
import Drawer from './Drawer';

import TopArtists from './TopArtists';
import TopTracks from './TopTracks';

type Timeframe = 'short_term' | 'medium_term' | 'long_term';
export const UserDataContext = React.createContext(
	{} as {
		playlists: SpotifyApi.PlaylistObjectSimplified[];
		saved: SpotifyApi.SavedTrackObject[];
		topArtists: SpotifyApi.ArtistObjectFull[];
		topTracks: SpotifyApi.TrackObjectFull[];
	}
);

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	const spotify = useContext(SpotifyContext);

	const timeframe = 'short_term';
	const [playlists, setPlaylists] = useState([] as SpotifyApi.PlaylistObjectSimplified[]);
	const [saved, setSaved] = useState([] as SpotifyApi.SavedTrackObject[]);
	const [topArtists, setTopArtists] = useState([] as SpotifyApi.ArtistObjectFull[]);
	const [topTracks, setTopTracks] = useState([] as SpotifyApi.TrackObjectFull[]);

	const getTopData = useCallback(
		(timeframe: Timeframe) =>
			Promise.all([
				spotify.getMyTopArtists({ limit: 50, time_range: timeframe }),
				spotify.getMyTopTracks({ limit: 50, time_range: timeframe }),
			]),
		[timeframe]
	);

	useEffect(() => {
		spotify.connected &&
			spotify
				.getMe()
				.then(({ id }) =>
					Promise.all([
						loop(spotify.getUserPlaylists)(id),
						spotify.getMySavedTracks(),
						getTopData(timeframe),
					])
				)
				.then(
					([_playlists, _saved, [_topArtists, _topTracks]]) => (
						setPlaylists(_playlists.items),
						setSaved(_saved.items),
						setTopArtists(_topArtists.items),
						setTopTracks(_topTracks.items)
					)
				);
	}, []);

	useEffect(() => {
		spotify.connected &&
			getTopData(timeframe).then(
				([_topArtists, _topTracks]) => (
					setTopArtists(_topArtists.items), setTopTracks(_topTracks.items)
				)
			);
	}, [timeframe]);

	return (
		<UserDataContext.Provider value={{ playlists, saved, topArtists, topTracks }}>
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
							<button onClick={() => (Storage.removeToken(), Storage.removeState())}>Reset</button>
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
		</UserDataContext.Provider>
	);
};

export default Main;
