import React, { useState } from 'react';
import Spotify, { hostname, Storage, wrapObj } from './Spotify';
import './App.css';

import { loop, getTracks, getCollaborators, timestampSort, buildTimeline } from './SpotifyScripts';

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
		}
	}

	return (
		<div className="App">
			{!Storage.accessToken && <button onClick={spotify.login}>login</button>}
		</div>
	);
};

export default App;
