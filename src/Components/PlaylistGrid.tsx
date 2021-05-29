import React from 'react';
import styled from 'styled-components';

const blockSize = 250; // px
const rem2Px = (rem: number) =>
	rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

export interface PlaylistGridProps {
	playlists: SpotifyApi.PlaylistObjectSimplified[];
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({ playlists }) => {
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
				<PlaylistBlock key={playlist.id} size={blockWidth} data={playlist}></PlaylistBlock>
			))}
		</div>
	);
};

export interface PlaylistBlockProps {
	size: number;
	data: SpotifyApi.PlaylistObjectSimplified;
}

const PlaylistBlock: React.FC<PlaylistBlockProps> = ({ size, data }) => {
	return (
		<div style={{}}>
			{data.images[0]?.url ? (
				<img
					src={data.images[0]?.url}
					alt={data.name}
					style={{ objectFit: 'cover', width: '100%', height: '100%' }}
				/>
			) : (
				data.name
			)}
		</div>
	);
};

export default PlaylistGrid;
