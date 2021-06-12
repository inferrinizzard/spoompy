import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { ButtonBase } from './Buttons';

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

const Table = styled.table`
	width: 100%;
`;

const TableHead = styled.thead`
	th {
		position: sticky;
		top: 0;
		font-size: 1.5rem;
		color: white;
		padding: 1rem;
		background-color: ${p => p.theme.black};
	}
`;

const TimeframeButton = styled(ButtonBase)`
	color: ${p => p.theme.lightgray};
	font-size: 2rem;
	display: inline-block;
	padding: 0 1rem;
	position: relative;

	&:hover {
		color: ${p => p.theme.white};
	}

	&.active:after {
		position: absolute;
		content: '';
		height: 0.25rem;
		bottom: -0.25rem;

		margin: 0 auto;
		left: 0;
		right: 0;
		width: 70%;
		background-color: ${p => p.theme.green};
	}
`;

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
			<div style={{ height: '50vh' }}>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					{Object.entries({
						short_term: '4 Weeks',
						medium_term: '6 Months',
						long_term: 'All-Time',
					}).map(([k, v]) => (
						<TimeframeButton
							key={k}
							className={timeframe === k ? 'active' : undefined}
							onClick={() => setTimeframe(k as Timerange)}>
							{v}
						</TimeframeButton>
					))}
				</div>
				<h1>Top Ten</h1>
				{props.topCarousel(top)}
			</div>
			<div style={{ height: '50vh', overflowY: 'auto' }}>
				<Table>
					<TableHead>{props.tableHeader}</TableHead>
					<tbody>{top.map(props.tableRow)}</tbody>
				</Table>
			</div>
		</div>
	);
};

export default DisplayTop;
