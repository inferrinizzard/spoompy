import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { ButtonBase } from './Buttons';

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

export const HighlightItem = styled.div`
	display: inline-block;
	vertical-align: top;
	text-align: center;
	max-width: 250px;

	h2 {
		white-space: break-spaces;
		color: ${p => p.theme.white};
		font-size: 1.25rem;
		margin: 0.5rem 0;
	}
`;

export interface DisplayTopProps<T> {
	data: T[];
	topCarousel: (data: T[]) => React.ReactChild | React.ReactChildren;
	tableHeader: React.ReactChild | React.ReactChildren;
	tableRow: (item: T, i: number) => React.ReactChild | React.ReactChildren;
}

const DisplayTop = <T extends {}>(props: React.PropsWithChildren<DisplayTopProps<T>>) => {
	const history = useHistory();

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
							className={
								new URLSearchParams(history.location.search).get('timeframe') === k
									? 'active'
									: undefined
							}
							onClick={() => history.push({ ...history.location, search: `?timeframe=${k}` })}>
							{v}
						</TimeframeButton>
					))}
				</div>
				<h1>Top Ten</h1>
				{props.topCarousel(props.data)}
			</div>
			<div style={{ height: '50vh', overflowY: 'auto' }}>
				{/* <h1 style={{ margin: 0 }}>Full List</h1> */}
				<Table>
					<TableHead>{props.tableHeader}</TableHead>
					<tbody>{props.data.map(props.tableRow)}</tbody>
				</Table>
			</div>
		</div>
	);
};

export default DisplayTop;
