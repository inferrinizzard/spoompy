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

const PlaylistExplorer: React.FC<PlaylistExplorerProps> = ({}) => {
	const spotify = useContext(SpotifyContext);

	const [playlists, setPlaylists] = useState([] as SpotifyApi.PlaylistObjectSimplified[]);

	useEffect(() => {
		spotify.connected &&
			loop(spotify.getUserPlaylists)('12121954989').then(({ items }) => setPlaylists(items));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const [active, setActive] = useState(null as ActivePlaylist);
	const loadActive = (playlist: SpotifyApi.PlaylistObjectSimplified) =>
		loop(spotify.getPlaylistTracks)(playlist.id).then(tracks =>
			setActive({ playlist, tracks: tracks.items })
		);

	return (
		<>
			<PlaylistGrid playlists={playlists} setActive={loadActive} />
			{active && <Inspect active={active} />}
			{active && (
				<button
					style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1 }}
					onClick={() => setActive(null)}>
					X
				</button>
			)}
		</>
	);
};

export default PlaylistExplorer;
