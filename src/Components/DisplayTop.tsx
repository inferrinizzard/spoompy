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
			{top.map(a => (
				<p style={{ color: 'white' }}>{a.name}</p>
			))}
		</div>
	);
};

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
