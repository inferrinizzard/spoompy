import React, { useContext } from 'react';
import styled from 'styled-components';

import { UserDataContext } from './Main';
import DisplayTop, { HighlightItem } from './DisplayTop';

import { ReactComponent as Heart } from '../icons/heart.svg';

const SavedMarker = styled.div`
	position: absolute;
	bottom: 0;
	right: 0;
	height: 48px;
	width: 48px;
	border-radius: 24px;
	margin: 8px;
	background-color: ${p => p.theme.green};
	box-shadow: 0 4px 4px ${p => p.theme.black}88;

	svg {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		height: 32px;
		width: 32px;
		fill: ${p => p.theme.white};
	}
`;

const TopTracks: React.FC<{}> = () => {
	const { saved, topTracks } = useContext(UserDataContext);

	return (
		<DisplayTop<SpotifyApi.TrackObjectFull>
			data={topTracks}
			topCarousel={data => (
				<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
					{data.slice(0, 10).map(track => (
						<HighlightItem key={track.id}>
							<div style={{ position: 'relative', height: 250, width: 250 }}>
								{saved.some(t => t.track.id === track.id) ? (
									<SavedMarker>
										<Heart />
									</SavedMarker>
								) : undefined}
								<img src={track.album.images[0].url} alt={track.name} height={250} width={250} />
							</div>
							<h2>{track.name}</h2>
							<div>{track.artists.map(({ name }) => name).join(', ')}</div>
							<div>{track.album.name}</div>
						</HighlightItem>
					))}
				</div>
			)}
			tableHeader={
				<tr>
					<th>Rank</th>
					<th colSpan={2}>Name</th>
					<th>Artists</th>
					<th>Album</th>
					<th>Popularity</th>
				</tr>
			}
			tableRow={(track, i) => (
				<tr key={track.id}>
					<td style={{ textAlign: 'center', fontSize: '2rem' }}>{`${i + 1}.`}</td>
					<td style={{ fontSize: '1.25rem' }}>
						<img src={track.album.images[0].url} alt={track.name} height={50} width={50} />
					</td>
					<td style={{ fontSize: '1.25rem' }}>{track.name}</td>
					<td style={{ fontSize: '1.25rem' }}>
						{track.artists.map(({ name }) => name).join(', ')}
					</td>
					<td style={{ fontSize: '1.25rem' }}>{track.album.name}</td>
					<td style={{ fontSize: '1.25rem' }}>{track.popularity}</td>
					{/* <td>{track.followers.total}</td> */}
				</tr>
			)}
		/>
	);
};

export default TopTracks;
