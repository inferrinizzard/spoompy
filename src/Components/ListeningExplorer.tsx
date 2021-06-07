/* eslint-disable no-loop-func */
import React, { useContext } from 'react';

import { SpotifyContext } from '../App';
import { loop } from '../SpotifyScripts';

export interface ListeningExplorerProps {}

const ListeningExplorer: React.FC<ListeningExplorerProps> = () => {
	const spotify = useContext(SpotifyContext);

	return (
		<>
			<button
			// onClick={() => (spotify.getMyTopArtists().then(console.log), spotify.getMyTopTracks().then(console.log))} // 'short_term' | 'medium_term' | 'long_term'
			>
				Get
			</button>
		</>
	);
};

export default ListeningExplorer;
