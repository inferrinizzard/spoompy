import React, { useContext } from 'react';

import { SpotifyContext } from '../App';
import { UserDataContext } from './Main';
import DisplayTop from './DisplayTop';

const TopTracks: React.FC<{}> = () => {
	const { topTracks } = useContext(UserDataContext);

	return (
		<DisplayTop<SpotifyApi.TrackObjectFull>
			data={topTracks}
			topCarousel={data => (
				<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
					{data.slice(0, 10).map(item => (
						<div key={item.id} style={{ display: 'inline-block' }}>
							<img src={item.album.images[0].url} alt={item.name} height={250} width={250} />
						</div>
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
