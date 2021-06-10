import React, { useState, useEffect, useContext, useCallback } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import { SpotifyContext } from '../App';

export interface DisplayTopProps {}

type Timerange = 'short_term' | 'medium_term' | 'long_term'; // store in route ?

const useFetchTopData = <
	T extends {},
	F extends (options: {}) => Promise<SpotifyApi.PagingObject<T>>
>(
	timeframe: Timerange,
	fetchFunction: F,
	setState: React.Dispatch<React.SetStateAction<T[]>>
) => {
	const getTop = useCallback(
		(timeframe: Timerange) =>
			fetchFunction({ limit: 50, time_range: timeframe }).then(({ items }) => items),
		[timeframe]
	);

	useEffect(() => {
		getTop(timeframe).then(setState);
	}, [timeframe]);
};

const DisplayArtists: React.FC<DisplayTopProps> = () => {
	const spotify = useContext(SpotifyContext);
	const [timeframe, setTimeframe] = useState('short_term' as Timerange);
	const [top, setTop] = useState([] as SpotifyApi.ArtistObjectFull[]);
	useFetchTopData<
		SpotifyApi.ArtistObjectFull,
		InstanceType<typeof SpotifyWebApi>['getMyTopArtists']
	>(timeframe, spotify.getMyTopArtists, setTop);

	return (
		<div>
			<button onClick={() => setTimeframe('short_term')}>Short</button>
			<button onClick={() => setTimeframe('medium_term')}>Medium</button>
			<button onClick={() => setTimeframe('long_term')}>Long</button>
			<p style={{ color: 'white' }}>{timeframe}</p>
			<h4>Top Ten</h4>
			<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
				{top.slice(0, 10).map(artist => (
					<div key={artist.id} style={{ display: 'inline-block' }}>
						<img src={artist.images[0].url} alt={artist.name} height={250} width={250} />
					</div>
				))}
			</div>
			<div>
				<table style={{ color: 'white' }}>
					<thead>
						<th>Rank</th>
						<th colSpan={2}>Name</th>
						<th>Genres</th>
						<th>Popularity</th>
						<th>Followers</th>
					</thead>
					<tbody>
						{top.map((artist, i) => (
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
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

const genreKeywords = {
	'edm': 'EDM',
	'uk': 'UK',
	'vgm': 'VGM',
	'r&b': 'R&B',
};

const replaceKeywords = (s: string) =>
	Object.entries(genreKeywords).reduce((str, [k, v]) => str.replace(k, v), s);

const DisplayTracks: React.FC<DisplayTopProps> = () => {
	const spotify = useContext(SpotifyContext);
	const [timeframe, setTimeframe] = useState('short_term' as Timerange);
	const [top, setTop] = useState([] as SpotifyApi.TrackObjectFull[]);
	useFetchTopData<SpotifyApi.TrackObjectFull, InstanceType<typeof SpotifyWebApi>['getMyTopTracks']>(
		timeframe,
		spotify.getMyTopTracks,
		setTop
	);

	return (
		<div>
			<button onClick={() => setTimeframe('short_term')}>Short</button>
			<button onClick={() => setTimeframe('medium_term')}>Medium</button>
			<button onClick={() => setTimeframe('long_term')}>Long</button>
			<p style={{ color: 'white' }}>{timeframe}</p>
			{top.map(a => (
				<p style={{ color: 'white' }}>{a.name}</p>
			))}
		</div>
	);
};

export { DisplayArtists, DisplayTracks };
