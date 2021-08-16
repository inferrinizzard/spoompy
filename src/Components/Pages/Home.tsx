import React, { useContext } from 'react';
import { Storage } from 'Spotify';

import { SpotifyContext } from 'App';
import { UserDataContext } from 'Components/Main';
import { TrackHighlights } from './TopTracks';
import { ArtistHighlights } from './TopArtists';

export interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
	const spotify = useContext(SpotifyContext);
	const { saved, topArtists, topTracks } = useContext(UserDataContext);

	return (
		<div>
			<div>
				{!spotify.connected && (
					<button onClick={() => spotify.login(window.location.origin + '/redirect')}>login</button>
				)}
				<button onClick={() => (spotify.reset(), document.location.reload())}>Reset</button>
			</div>
			{TrackHighlights(saved, 200)(topTracks)}
			{ArtistHighlights(saved, 200)(topArtists)}
		</div>
	);
};

export default Home;
