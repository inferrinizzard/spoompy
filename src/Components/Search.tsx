import React, { useState } from 'react';

export interface SearchProps {
	spotify: SpotifyType;
	addArtist: (artist: string) => void;
}

const Search: React.FC<SearchProps> = ({ spotify, addArtist }) => {
	const [query, setQuery] = useState('');
	const [searchResults, setSearchResults] = useState(
		[] as Pick<SpotifyApi.ArtistObjectFull, 'name' | 'id' | 'images'>[]
	);

	const setResults = (res: SpotifyApi.ArtistSearchResponse) =>
		setSearchResults(res.artists.items.map(({ id, name, images }) => ({ id, name, images })));
	// const searchArtists = (page: number = 0) => spotify.searchArtists(query, { offset: 20 * page }).then(setResults);

	return (
		<div
			style={{
				height: '100vh',
				width: '20vw',
				position: 'fixed',
				left: 0,
				top: 0,
				backgroundColor: 'aliceblue',
			}}>
			<input
				type="text"
				value={query}
				placeholder="Search for an Artist!"
				onChange={e => setQuery(e.target.value)}
			/>
			<button onClick={() => spotify.searchArtists(query).then(setResults)}>{'Search'}</button>
			<div style={{ overflowY: 'scroll' }}>
				{searchResults.map(r => (
					<div key={r.id} onClick={() => addArtist(r.id)}>
						{r.images && <img src={r.images[0]?.url} height={64} width={64} />}
						<h5 style={{ display: 'inline-block' }}>{r.name}</h5>
					</div>
				))}
			</div>
		</div>
	);
};

export default Search;
