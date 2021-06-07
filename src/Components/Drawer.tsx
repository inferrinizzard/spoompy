import React from 'react';
import styled from 'styled-components';

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
			<LinkButton text="Home" to="/home"></LinkButton>
			<LinkButton text="Top Tracks" to="/top/tracks"></LinkButton>
			<LinkButton text="Top Artists" to="/top/artists"></LinkButton>
			<LinkButton text="Playlist Analysis" to="/playlists"></LinkButton>
			<LinkButton text="Listening History" to="/listening"></LinkButton>
			<LinkButton text="Info" to="/info"></LinkButton>
		</DrawerBase>
	);
};

export default Drawer;
