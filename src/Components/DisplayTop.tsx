import React, { useState, useEffect, useContext, useCallback } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

import { SpotifyContext } from '../App';

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

export interface DisplayTopProps<T> {
	fetchFunction: (options: {}) => Promise<SpotifyApi.PagingObject<T>>;
	topCarousel: (data: T[]) => React.ReactChild | React.ReactChildren;
	tableHeader: React.ReactChild | React.ReactChildren;
	tableRow: (item: T, i: number) => React.ReactChild | React.ReactChildren;
}

const DisplayTop = <T extends {}>(props: React.PropsWithChildren<DisplayTopProps<T>>) => {
	const [timeframe, setTimeframe] = useState('short_term' as Timerange);
	const [top, setTop] = useState([] as T[]);
	useFetchTopData<T, typeof props.fetchFunction>(timeframe, props.fetchFunction, setTop);

	return (
		<div>
			<button onClick={() => setTimeframe('short_term')}>Short</button>
			<button onClick={() => setTimeframe('medium_term')}>Medium</button>
			<button onClick={() => setTimeframe('long_term')}>Long</button>
			<p style={{ color: 'white' }}>{timeframe}</p>
			<h4>Top Ten</h4>
			{props.topCarousel(top)}
			<div>
				<table style={{ color: 'white' }}>
					<thead>{props.tableHeader}</thead>
					<tbody>{top.map(props.tableRow)}</tbody>
				</table>
			</div>
		</div>
	);
};

export default DisplayTop;

const DisplayTracks: React.FC<DisplayTopProps<any>> = () => {
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
