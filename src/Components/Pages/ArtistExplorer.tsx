import React from 'react';

export interface ArtistExplorerProps {}

const ArtistExplorer: React.FC<ArtistExplorerProps> = () => {
	return (
		<div>
			<h1 style={{ margin: '0.5rem' }}>Artist Explorer</h1>
			<div>Graph goes here</div>
		</div>
	);
};

export default ArtistExplorer;
