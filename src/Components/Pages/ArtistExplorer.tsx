import React, { useState, useContext } from 'react';

import ForceGraph from 'react-force-graph-2d';

import Profile from 'icons/profile.svg';

import { SpotifyContext } from 'App';

interface GraphDatum {
	id: string;
	name: string;
	val?: number;
}

export interface ArtistExplorerProps {}

const ArtistExplorer: React.FC<ArtistExplorerProps> = () => {
	const spotify = useContext(SpotifyContext);

	const [query, setQuery] = useState('');
	const [results, setResults] = useState([] as SpotifyApi.ArtistObjectFull[]);
	const [artists, setArtists] = useState([] as GraphDatum[]);
	const [links, setLinks] = useState([]);

	const searchArtists = (query: string) =>
		spotify.searchArtists(query).then(({ artists: { items } }) => setResults(items));

	const addArtist = (artist: SpotifyApi.ArtistObjectFull) =>
		artists.every(a => a.id !== artist.id) && setArtists([...artists, artist]);

	return (
		<div style={{ position: 'relative' }}>
			<div
				style={{
					position: 'absolute',
					display: 'flex',
					width: '100%',
					justifyContent: 'space-between',
					alignItems: 'center',
					zIndex: 1,
				}}>
				<h1 style={{ margin: '0.5rem' }}>Artist Explorer</h1>
				<div style={{ position: 'relative' }}>
					<input
						type="text"
						value={query}
						placeholder="Search for an Artist!"
						onChange={e => setQuery(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && searchArtists(query)}
					/>
					<button onClick={() => searchArtists(query)}>{'Search'}</button>
					{results.length > 0 && (
						<div
							style={{
								position: 'absolute',
								top: '-100%',
								overflow: 'auto',
								maxHeight: 'calc(100vh - 5rem)',
								marginTop: '5rem',
							}}>
							{results.map(r => (
								<div key={r.id} onClick={() => addArtist(r)}>
									{r.images && (
										<img
											src={r.images[0]?.url ?? Profile}
											alt={r.name}
											height={64}
											width={64}
											style={{ filter: r.images[0]?.url ? undefined : 'invert(1)' }}
										/>
									)}
									<h5 style={{ display: 'inline-block' }}>{r.name}</h5>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			<ForceGraph
				graphData={{ nodes: artists, links }}
				linkColor={() => 'white'}
				// nodeCanvasObject={}
			/>
		</div>
	);
};

export default ArtistExplorer;
