import React, { useState, useEffect, useContext, useCallback } from 'react';
import { loop, loopSolo } from 'SpotifyScripts';

import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import { SpotifyContext } from 'App';
import Home from './Pages/Home';
import Drawer from './Elements/Drawer';

import TopArtists from './Pages/TopArtists';
import TopTracks from './Pages/TopTracks';
import PlaylistExplorer from './Pages/PlaylistExplorer';
import ListeningExplorer from './Pages/ListeningExplorer';

type Timeframe = 'short_term' | 'medium_term' | 'long_term';
const getTimeframe = (history: ReturnType<typeof useHistory>) =>
	new URLSearchParams(history.location.search).get('timeframe') || 'short_term';

interface UserData {
	user: SpotifyApi.CurrentUsersProfileResponse;
	playlists: SpotifyApi.PlaylistObjectSimplified[];
	saved: SpotifyApi.SavedTrackObject[];
	topArtists: SpotifyApi.ArtistObjectFull[];
	topTracks: SpotifyApi.TrackObjectFull[];
}
export const UserDataContext = React.createContext({} as UserData);

export interface MainProps {}

const Main: React.FC<MainProps> = () => {
	const spotify = useContext(SpotifyContext);
	const history = useHistory();
	let timeframe = getTimeframe(history);

	const [user, setUser] = useState({} as UserData['user']);
	const [playlists, setPlaylists] = useState([] as UserData['playlists']);
	const [saved, setSaved] = useState([] as UserData['saved']);
	const [topArtists, setTopArtists] = useState([] as UserData['topArtists']);
	const [topTracks, setTopTracks] = useState([] as UserData['topTracks']);

	const getTopData = useCallback(
		(timeframe: Timeframe) =>
			Promise.all([
				spotify.getMyTopArtists({ limit: 50, time_range: timeframe }),
				spotify.getMyTopTracks({ limit: 50, time_range: timeframe }),
			]),
		[timeframe]
	);

	const updateTimeframe = () => {
		// data responds to route instead of route responds to data
		spotify.connected &&
			getTopData(getTimeframe(history) as Timeframe).then(
				([_topArtists, _topTracks]) => (
					setTopArtists(_topArtists.items), setTopTracks(_topTracks.items)
				)
			);
	};

	useEffect(() => {
		spotify.connected &&
			spotify
				.getMe()
				.then(res => (setUser(res), res))
				.then(({ id }) =>
					Promise.all([loop(spotify.getUserPlaylists)(id), loopSolo(spotify.getMySavedTracks)()])
				)
				.then(([_playlists, _saved]) => (setPlaylists(_playlists.items), setSaved(_saved.items)));
		updateTimeframe();
		history.location.pathname.includes('top') &&
			history.push({ ...history.location, search: `?timeframe=${timeframe}` });
		history.listen(updateTimeframe);
	}, []);

	return (
		<UserDataContext.Provider value={{ user, playlists, saved, topArtists, topTracks }}>
			<Drawer />
			<div style={{ marginLeft: '15%', width: '85%', height: '100%', overflowX: 'hidden' }}>
				{/* overflow for scroll bar width */}
				<div className="header"></div>
				<Switch>
					<Route path="/home">
						<Home />
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
		</UserDataContext.Provider>
	);
};

export default Main;
