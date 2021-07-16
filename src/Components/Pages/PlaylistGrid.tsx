import React, { useRef, useContext } from 'react';
import styled from 'styled-components';

import { UserDataContext } from 'Components/Main';

import Track from 'icons/track.svg';

const blockSize = 250; // px
const rem2Px = (rem: number) =>
	rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export interface PlaylistGridProps {
	setActive: (playlist: SpotifyApi.PlaylistBaseObject) => void;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ setActive }) => {
	const { playlists } = useContext(UserDataContext);
	const gridRef = useRef<HTMLDivElement>(null);
	const containerWidth = gridRef.current?.clientWidth;

	const numColumns = containerWidth ? Math.floor(containerWidth / blockSize) : 5;
	const blockWidth = containerWidth
		? (containerWidth - rem2Px(numColumns + 1)) / numColumns
		: blockSize;

	const savedData = {
		collaborative: false,
		description: null,
		external_urls: {},
		href: 'https://api.spotify.com/v1/me/tracks',
		id: 'saved',
		images: [{ url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png' }],
		name: 'Saved Songs',
		public: false,
		snapshot_id: '',
		type: 'playlist',
		uri: '',
	} as SpotifyApi.PlaylistBaseObject;

	return (
		<div
			ref={gridRef}
			style={{
				margin: '1rem',
				display: 'grid',
				gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
				gridAutoRows: blockWidth,
				gridGap: '1rem',
			}}>
			<PlaylistBlock data={savedData} setActive={setActive} />
			{playlists.map(playlist => (
				<PlaylistBlock key={playlist.id} data={playlist} setActive={setActive}></PlaylistBlock>
			))}
		</div>
	);
};

const ImageBlock = styled.div`
	position: relative;
	&:after,
	&:before {
		content: '';
		position: absolute;
		opacity: 0;
		transition: all 0.5s;
	}
	&:after {
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.45);
	}
	&:before {
		color: #fff;
		z-index: 1;
		top: 50%;
		padding: 4px 10px;
		text-align: center;
		box-sizing: border-box;
	}
	&:hover:before {
		content: attr(data-content);
	}
	&:hover:after,
	&:hover:before {
		width: 100%;
		opacity: 1;
	}
`;

export interface PlaylistBlockProps {
	data: SpotifyApi.PlaylistBaseObject;
	setActive: PlaylistGridProps['setActive'];
}

const PlaylistBlock: React.FC<PlaylistBlockProps> = ({ data, setActive }) => {
	return (
		<ImageBlock data-content={data.name} onClick={() => data.images.length && setActive(data)}>
			<img
				src={data.images[0]?.url ?? Track}
				alt={data.name}
				style={{
					objectFit: 'cover',
					width: '100%',
					height: '100%',
					filter: !data.images[0]?.url ? 'contrast(0)' : undefined,
				}}
			/>
		</ImageBlock>
	);
};

export default PlaylistGrid;
