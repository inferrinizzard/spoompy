import React, { useContext } from 'react';

import { UserDataContext } from 'Components/Main';
import DisplayTop, { DisplayTopProps, HighlightItem } from 'Components/Elements/DisplayTop';

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

export const ArtistHighlights =
	(
		saved: SpotifyApi.SavedTrackObject[],
		size = 250
	): DisplayTopProps<SpotifyApi.ArtistObjectFull>['topCarousel'] =>
	data =>
		(
			<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
				{data.slice(0, 10).map(artist => (
					<HighlightItem key={artist.id} size={size}>
						<img src={artist.images[0].url} alt={artist.name} height={size} width={size} />
						<h2>{artist.name}</h2>
						{(count =>
							count ? <div>{`${count} Saved Track${count === 1 ? '' : 's'}`}</div> : null)(
							saved.filter(({ track }) => track.artists.some(({ id }) => id === artist.id)).length
						)}
					</HighlightItem>
				))}
			</div>
		);

export interface TopArtistsProps {}

const TopArtists: React.FC<TopArtistsProps> = () => {
	const { saved, topArtists } = useContext(UserDataContext);

	return (
		<DisplayTop<SpotifyApi.ArtistObjectFull>
			data={topArtists}
			topCarousel={ArtistHighlights(saved)}
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
