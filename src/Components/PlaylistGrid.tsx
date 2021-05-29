import React from 'react';
import styled from 'styled-components';

const blockSize = 250; // px
const rem2Px = (rem: number) =>
	rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export interface PlaylistGridProps {
	playlists: SpotifyApi.PlaylistObjectSimplified[];
	setActive: (playlist: SpotifyApi.PlaylistObjectSimplified) => void;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, setActive }) => {
	const numColumns = Math.floor(window.innerWidth / blockSize);
	const blockWidth = (window.innerWidth - rem2Px(numColumns + 1)) / numColumns;
	return (
		<div
			style={{
				margin: '1rem',
				display: 'grid',
				gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
				gridAutoRows: blockWidth,
				gridGap: '1rem',
			}}>
			{playlists.map(playlist => (
				<PlaylistBlock key={playlist.id} data={playlist} onClick={setActive}></PlaylistBlock>
			))}
		</div>
	);
};

const ImageBlock = styled.div`
	&:after,
	&:before {
		position: absolute;
		opacity: 0;
		transition: all 0.5s;
		width: 100%;
	}
	&:after {
		content: '';
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.45);
	}
	&:before {
		content: attr(data-content);
		color: #fff;
		z-index: 1;
		top: 50%;
		padding: 4px 10px;
		text-align: center;
		box-sizing: border-box;
	}
	&:hover:after,
	&:hover:before {
		opacity: 1;
	}
`;

export interface PlaylistBlockProps {
	data: SpotifyApi.PlaylistObjectSimplified;
	onClick: PlaylistGridProps['setActive'];
}

const PlaylistBlock: React.FC<PlaylistBlockProps> = ({ data, onClick }) => {
	return (
		<ImageBlock
			data-content={data.name}
			onClick={() => onClick(data)}
			style={{ position: 'relative' }}>
			<img
				src={data.images[0]?.url ?? ''}
				alt={data.name}
				style={{ objectFit: 'cover', width: '100%', height: '100%' }}
			/>
		</ImageBlock>
	);
};

export default PlaylistGrid;
