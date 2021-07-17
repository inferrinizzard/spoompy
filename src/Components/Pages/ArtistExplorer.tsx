import React, { useState, useContext } from 'react';

import ForceGraph from 'react-force-graph-2d';

import { SpotifyContext } from 'App';

export interface ArtistExplorerProps {}

const ArtistExplorer: React.FC<ArtistExplorerProps> = () => {
	const spotify = useContext(SpotifyContext);

	const [artists, setArtists] = useState([
		{ id: 0, name: '0', val: '1' },
		{ id: 1, name: '1', val: '1' },
		{ id: 2, name: '2', val: '1' },
		{ id: 3, name: '3', val: '1' },
	]);
	const [links, setLinks] = useState([
		{ source: 1, target: 2 },
		{ source: 3, target: 0 },
		{ source: 0, target: 1 },
		{ source: 2, target: 3 },
	]);

	return (
		<div>
			<h1 style={{ margin: '0.5rem' }}>Artist Explorer</h1>
			<div>
				<ForceGraph
					graphData={{ nodes: artists, links }}
					linkColor={() => 'white'}
					// nodeCanvasObject={}
				/>
			</div>
		</div>
	);
};

export default ArtistExplorer;
