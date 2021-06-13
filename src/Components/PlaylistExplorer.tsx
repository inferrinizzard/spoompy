import React, { useState, useEffect, useContext } from 'react';

import { loop } from '../SpotifyScripts';
import { SpotifyContext } from '../App';
import Inspect from './Inspect';
import PlaylistGrid from './PlaylistGrid';

export type ActivePlaylist = {
	playlist: SpotifyApi.PlaylistObjectSimplified;
	tracks: SpotifyApi.PlaylistTrackObject[];
} | null;

export interface PlaylistExplorerProps {}

const PlaylistExplorer: React.FC<PlaylistExplorerProps> = () => {
	const spotify = useContext(SpotifyContext);

	const [active, setActive] = useState(null as ActivePlaylist);
	const loadActive = (playlist: SpotifyApi.PlaylistObjectSimplified) =>
		loop(spotify.getPlaylistTracks)(playlist.id).then(tracks =>
			setActive({ playlist, tracks: tracks.items })
		);

	return (
		<div>
			<PlaylistGrid setActive={loadActive} />
			{active && <Inspect active={active} />}
			{active && (
				<button
					style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1 }}
					onClick={() => setActive(null)}>
					X
				</button>
			)}
		</div>
	);
};

export default PlaylistExplorer;
