import React, { useState } from 'react';

export interface SearchProps {
	spotify: SpotifyType;
	addArtist: (artist: string, name: string) => void;
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
				height: '100%',
				width: '100%',
				backgroundColor: 'aliceblue',
			}}>
			<input
				type="text"
				value={query}
				placeholder="Search for an Artist!"
				onChange={e => setQuery(e.target.value)}
				onKeyDown={e =>
					e.key === 'Enter' &&
					spotify.searchArtists((e.target as HTMLInputElement).value).then(setResults)
				}
			/>
			<button onClick={() => spotify.searchArtists(query).then(setResults)}>{'Search'}</button>
			<div style={{ height: '100%', overflowY: 'scroll' }}>
				{searchResults.map(r => (
					<div key={r.id} onClick={() => addArtist(r.id, r.name)}>
						{r.images && <img src={r.images[0]?.url} height={64} width={64} alt={r.name} />}
						<h5 style={{ display: 'inline-block' }}>{r.name}</h5>
					</div>
				))}
			</div>
		</div>
	);
};

export default Search;
