import React, { useContext } from 'react';

import { SpotifyContext } from '../App';
import DisplayTop from './DisplayTop';

const genreKeywords = {
	'edm': 'EDM',
	'uk': 'UK',
	'vgm': 'VGM',
	'r&b': 'R&B',
};

const replaceKeywords = (s: string) =>
	Object.entries(genreKeywords).reduce((str, [k, v]) => str.replace(k, v), s);

const TopArtists: React.FC<{}> = () => {
	const spotify = useContext(SpotifyContext);

	return (
		<DisplayTop<SpotifyApi.ArtistObjectFull>
			fetchFunction={spotify.getMyTopArtists}
			topCarousel={data => (
				<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
					{data.slice(0, 10).map(item => (
						<div key={item.id} style={{ display: 'inline-block' }}>
							<img src={item.images[0].url} alt={item.name} height={250} width={250} />
						</div>
					))}
				</div>
			)}
			tableHeader={
				<>
					<th>Rank</th>
					<th colSpan={2}>Name</th>
					<th>Genres</th>
					<th>Popularity</th>
					<th>Followers</th>
				</>
			}
			tableRow={(artist, i) => (
				<tr key={artist.id}>
					<td>
						<p style={{ fontSize: '1rem' }}>{`${i + 1}.`}</p>
					</td>
					<td>
						<img src={artist.images[0].url} alt={artist.name} height={50} width={50} />
					</td>
					<td>{artist.name}</td>
					<td>
						{artist.genres
							.map(g =>
								replaceKeywords(g)
									.split(' ')
									.map(s => s[0].toUpperCase() + s.slice(1))
									.join(' ')
							)
							.join(', ')}
					</td>
					<td>{artist.popularity}</td>
					<td>{artist.followers.total}</td>
				</tr>
			)}
		/>
	);
};

export default TopArtists;
