import React, { useRef } from 'react';
import styled from 'styled-components';

const blockSize = 250; // px
const rem2Px = (rem: number) =>
	rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export interface PlaylistGridProps {
	playlists: SpotifyApi.PlaylistObjectSimplified[];
	setActive: (playlist: SpotifyApi.PlaylistObjectSimplified) => void;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists, setActive }) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const containerWidth = gridRef.current?.clientWidth;

	const numColumns = containerWidth ? Math.floor(containerWidth / blockSize) : 5;
	const blockWidth = containerWidth
		? (containerWidth - rem2Px(numColumns + 1)) / numColumns
		: blockSize;
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
			{playlists.map(playlist => (
				<PlaylistBlock key={playlist.id} data={playlist} setActive={setActive}></PlaylistBlock>
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
		width: 100%;
		opacity: 1;
	}
`;

export interface PlaylistBlockProps {
	data: SpotifyApi.PlaylistObjectSimplified;
	setActive: PlaylistGridProps['setActive'];
}

const PlaylistBlock: React.FC<PlaylistBlockProps> = ({ data, setActive }) => {
	return (
		<ImageBlock
			data-content={data.name}
			onClick={() => setActive(data)}
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
