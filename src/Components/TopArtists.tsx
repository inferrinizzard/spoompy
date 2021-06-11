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

const parseFollowers = (count: string | number) =>
	['k', 'm', 'b'].reduce(
		(num, suffix) =>
			typeof num === 'string'
				? num
				: num / 1000 > 1000
				? num / 1000
				: Math.floor(num / 1000) + suffix,
		+count as string | number
	);

export interface TopArtistsProps {}

const TopArtists: React.FC<TopArtistsProps> = () => {
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
				<tr>
					<th>Rank</th>
					<th colSpan={2}>Name</th>
					<th>Genres</th>
					<th>Popularity</th>
					<th>Followers</th>
				</tr>
			}
			tableRow={(artist, i) => (
				<tr key={artist.id}>
					<td style={{ textAlign: 'center', fontSize: '2rem' }}>{`${i + 1}.`}</td>
					<td>
						<img src={artist.images[0].url} alt={artist.name} height={50} width={50} />
					</td>
					<td style={{ fontSize: '1.25rem' }}>{artist.name}</td>
					<td style={{ fontSize: '1.25rem', textOverflow: 'ellipsis' }}>
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
					<td style={{ textAlign: 'center', fontSize: '1.25rem' }}>
						{parseFollowers(artist.followers.total)}
					</td>
				</tr>
			)}
		/>
	);
};

export default TopArtists;
