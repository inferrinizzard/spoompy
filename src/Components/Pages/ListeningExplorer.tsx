/* eslint-disable no-loop-func */
import React, { useState, useEffect, useContext } from 'react';
// equalizer: https://open.scdn.co/cdn/images/equaliser-animated-green.73b73928.gif

import { SpotifyContext } from 'App';
import { loop } from 'SpotifyScripts';

export interface ListeningExplorerProps {}

const ListeningExplorer: React.FC<ListeningExplorerProps> = () => {
	const spotify = useContext(SpotifyContext);

	const [recents, setRecents] = useState([] as SpotifyApi.PlayHistoryObject[]);
	useEffect(() => {
		spotify.getMyRecentlyPlayedTracks({ limit: 50 }).then(({ items }) => setRecents(items));
	}, []);

	return (
		<>
			<h3>Recently Played</h3>
			{recents.length && (
				<div>
					{recents.map(song => (
						<div key={song.track.id + song.played_at}>{song.track.name}</div>
					))}
				</div>
			)}
		</>
	);
};

export default ListeningExplorer;
