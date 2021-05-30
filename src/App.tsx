import React, { useState, useEffect } from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import { loop, getTracks, getCollaborators, timestampSort, buildTimeline } from './SpotifyScripts';
import PlaylistGrid from './Components/PlaylistGrid';
import Inspect from './Components/Inspect';

export type ActivePlaylist = {
	playlist: SpotifyApi.PlaylistObjectSimplified;
	tracks: SpotifyApi.PlaylistTrackObject[];
} | null;

const spotify = wrapObj(new Spotify('104889eeeb724a9ca5efa673f527f38f'));

const App: React.FC = () => {
	// move to redirect page
	if (window.location.hash) {
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

	const [playlists, setPlaylists] = useState([] as SpotifyApi.PlaylistObjectSimplified[]);

	useEffect(() => {
		Storage.accessToken &&
			loop(spotify.getUserPlaylists)('12121954989').then(({ items }) => setPlaylists(items));
	}, []);

	const [active, setActive] = useState(null as ActivePlaylist);
	const loadActive = (playlist: SpotifyApi.PlaylistObjectSimplified) =>
		loop(spotify.getPlaylistTracks)(playlist.id).then(tracks =>
			setActive({ playlist, tracks: tracks.items })
		);

	return (
		<div className="App">
			{!Storage.accessToken && <button onClick={spotify.login}>login</button>}
			<PlaylistGrid playlists={playlists} setActive={loadActive} />
			{active && <Inspect active={active} />}
		</div>
	);
};

export default App;
