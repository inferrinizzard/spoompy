import React, { useState, useContext } from 'react';
import { loop } from '../SpotifyScripts';

import { SpotifyContext } from '../App';
import { UserDataContext } from './Main';

import Inspect from './Inspect';
import PlaylistGrid from './PlaylistGrid';

export type ActivePlaylist = {
	playlist: SpotifyApi.PlaylistBaseObject;
	tracks: SpotifyApi.PlaylistTrackObject[];
} | null;

export interface PlaylistExplorerProps {}

const PlaylistExplorer: React.FC<PlaylistExplorerProps> = () => {
	const spotify = useContext(SpotifyContext);
	const { user, saved } = useContext(UserDataContext);
	const publicUser = (({ birthdate, country, email, product, ...rest }) => rest)(user);

	const [active, setActive] = useState(null as ActivePlaylist);
	const loadActive = (playlist: SpotifyApi.PlaylistBaseObject) =>
		playlist.id === 'saved'
			? setActive({
					playlist: { ...playlist, owner: publicUser },
					tracks: saved.map(track => ({
						...track,
						added_by: publicUser,
						is_local: false,
					})) as SpotifyApi.PlaylistTrackObject[],
			  })
			: loop(spotify.getPlaylistTracks)(playlist.id).then(tracks =>
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
