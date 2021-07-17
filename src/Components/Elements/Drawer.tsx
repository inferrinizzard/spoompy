import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Home } from 'icons/home.svg';
import { ReactComponent as Track } from 'icons/track.svg';
import { ReactComponent as Album } from 'icons/album.svg';
import { ReactComponent as Profile } from 'icons/profile.svg';
import { ReactComponent as Library } from 'icons/library.svg';
import { ReactComponent as Duration } from 'icons/duration.svg';
import { ReactComponent as Edit } from 'icons/edit.svg';

import { LinkButton } from './Buttons';

const DrawerBase = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 15%;
	height: 100%;
	background-color: ${p => p.theme.black};
`;

export interface DrawerProps {}

const Drawer: React.FC<DrawerProps> = () => {
	return (
		<DrawerBase>
			<LinkButton text="Home" to={{ pathname: '/home', search: '' }} icon={Home} />
			<LinkButton text="Top Tracks" to="/top/tracks" icon={Track} />
			<LinkButton text="Top Artists" to="/top/artists" icon={Profile} />
			<LinkButton
				text="Playlist Analysis"
				to={{ pathname: '/playlists', search: '' }}
				icon={Library}
			/>
			<LinkButton
				text="Listening History"
				to={{ pathname: '/listening', search: '' }}
				icon={Duration}
			/>
			<LinkButton
				text="Artist Graph"
				to={{ pathname: '/artist-graph', search: '' }}
				icon={Profile}
			/>
			<LinkButton text="Info" to={{ pathname: '/info', search: '' }} icon={Edit} />
		</DrawerBase>
	);
};

export default Drawer;
