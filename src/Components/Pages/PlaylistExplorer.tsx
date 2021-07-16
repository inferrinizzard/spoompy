import React, { useState, useContext } from 'react';
import { loop } from 'SpotifyScripts';

import { SpotifyContext } from 'App';
import { UserDataContext } from 'Components/Main';

import Inspect from 'Components/Elements/Inspect';
import PlaylistGrid from './PlaylistGrid';
import { ButtonBase, SVGIcon } from 'Components/Elements/Buttons';

import { ReactComponent as Close } from 'icons/close.svg';

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
		<div style={{ position: 'relative' }}>
			<PlaylistGrid setActive={loadActive} />
			{active && <Inspect active={active} />}
			{active && (
				<ButtonBase
					style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}
					onClick={() => setActive(null)}>
					<SVGIcon icon={Close} />
				</ButtonBase>
			)}
		</div>
	);
};

export default PlaylistExplorer;
