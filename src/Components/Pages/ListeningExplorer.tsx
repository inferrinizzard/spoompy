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
			<h1 style={{ margin: '0.5rem' }}>Recently Played</h1>
			{recents.length && (
				<div>
					<table>
						<thead>
							<th>Name</th>
							<th>Artists</th>
							{/* <th>Played From</th> */}
							<th>Played At</th>
						</thead>
						<tbody>
							{recents.map(song => (
								<tr key={song.track.id + song.played_at}>
									<td>{song.track.name}</td>
									<td>{song.track.artists.map(({ name }) => name).join(', ')}</td>
									{/* <td>{song.context.href}</td> */}
									<td>{song.played_at}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default ListeningExplorer;
